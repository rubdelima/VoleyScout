from app.db import db, PARAM_PLACEHOLDER
from fastapi import HTTPException
import pandas as pd  # type: ignore
import uuid
import app.schemas as schemas
from typing import List, Optional

def add_player(player: schemas.PlayerBase) -> str:
    """
    Insere um novo jogador no banco de dados.

    Parâmetros:
        player: Objeto do tipo PlayerBase com os dados do jogador.
                O atributo 'team' corresponde ao teamId no banco.

    Retorna:
        O ID gerado para o jogador.
    """
    player_id = str(uuid.uuid4())
    
    conn, cursor = db.get_db_connection()
    query = f"""INSERT INTO Player (id, name, nickname, position, number, height, birthdate, isCaptain, teamId)
           VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, 
           {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})"""
    
    cursor.execute(
        query,
        (player_id, player.name, player.nickname, player.position, player.number, 
         player.height, player.birthdate, player.isCaptain, player.team)
    )
    conn.commit()
    conn.close()
    return player_id

def get_player(player_id: str) -> schemas.PlayerDB:
    """
    Retorna os dados de um jogador a partir do seu ID.

    Parâmetros:
        player_id: ID do jogador.

    Retorna:
        Objeto do tipo PlayerDB com os dados do jogador.

    Levanta:
        HTTPException (404) se o jogador não for encontrado.
    """
    try:
        conn, cursor = db.get_db_connection()
        query = f"""SELECT id, name, nickname, position, number, height, birthdate, isCaptain, teamId
                   FROM Player WHERE id = {PARAM_PLACEHOLDER}"""
        cursor.execute(query, (player_id,))
        player = cursor.fetchone()
        if not player:
            raise HTTPException(status_code=404, detail="Player Not Found")
        pid, name, nickname, position, number, height, birthdate, isCaptain, team_id = player
        player_data = schemas.PlayerDB(
            id=pid, name=name, nickname=nickname, position=position,
            number=number, height=height, birthdate=birthdate, isCaptain=bool(isCaptain), team=team_id
        )
        return player_data
    except HTTPException as he:
        print(f"Erro ao buscar jogador {player_id}: {he}")
        raise he
    finally:
        conn.close()

def get_player_reports(player_id: str, match_id: Optional[str] = None):
    try:
        conn, cursor = db.get_db_connection()

        if match_id:
            query = f"""
                SELECT matchId, playerId, setNumber, analyzer, reportTime, playerInSet, hasSubs, playerIn,
                       serveCorrect, servePoint, serveError,
                       attackCorrect, attackPoint, attackError,
                       receptionA, receptionB, receptionC, receptionError,
                       blockCorrect, blockSoft, blockError,
                       setA, setB, setC, setD, setError
                FROM SetReport WHERE playerId = {PARAM_PLACEHOLDER} AND matchId = {PARAM_PLACEHOLDER}
            """
            params = (player_id, match_id)
        else:
            query = f"""
                SELECT matchId, playerId, setNumber, analyzer, reportTime, playerInSet, hasSubs, playerIn,
                       serveCorrect, servePoint, serveError,
                       attackCorrect, attackPoint, attackError,
                       receptionA, receptionB, receptionC, receptionError,
                       blockCorrect, blockSoft, blockError,
                       setA, setB, setC, setD, setError
                FROM SetReport WHERE playerId = {PARAM_PLACEHOLDER}
            """
            params = (player_id,)

        # Para pandas.read_sql_query é necessário passar a conexão, não o cursor
        df = pd.read_sql_query(query, conn, params=params)

        if df.empty:
            return []

        reports = df.to_dict(orient="records")
        reports = [schemas.SetReport(**report) for report in reports]

        return reports

    except Exception as e:
        print(f"Erro ao buscar relatórios do jogador {player_id}: {e}")
        return []

    finally:
        conn.close()

def get_report_stats(player_id: str, match_id: str, previous: bool = False) -> schemas.PlayerReportResponse:
    """
    Gera estatísticas de desempenho de um jogador em uma partida.
    """
    conn, cursor = db.get_db_connection()
    
    try:
        query = f"""
            SELECT setNumber, serveCorrect, servePoint, serveError, 
                   attackCorrect, attackPoint, attackError, 
                   receptionA, receptionB, receptionC, receptionError, 
                   blockCorrect, blockSoft, blockError, 
                   setA, setB, setC, setD, setError 
            FROM SetReport WHERE playerId = {PARAM_PLACEHOLDER} AND matchId = {PARAM_PLACEHOLDER}
        """
        df = pd.read_sql_query(query, conn, params=(player_id, match_id))

        if df.empty:
            raise HTTPException(status_code=404, detail="Nenhum relatório encontrado para esse jogador nesta partida.")

        action_mapping = {
            "serve": ["serveCorrect", "servePoint", "serveError"],
            "attack": ["attackCorrect", "attackPoint", "attackError"],
            "reception": ["receptionA", "receptionB", "receptionC", "receptionError"],
            "block": ["blockCorrect", "blockSoft", "blockError"],
            "set": ["setA", "setB", "setC", "setD", "setError"]
        }

        action_tables = {}
        for action, cols in action_mapping.items():
            action_df = df[["setNumber"] + cols].copy()
            action_df["correct"] = action_df[cols[:-1]].sum(axis=1)
            action_df["points"] = action_df[cols[1]] if action in ["serve", "attack", "block"] else 0
            action_df["errors"] = action_df[cols[-1]]
            action_df["tries"] = action_df["correct"] + action_df["errors"] + action_df["points"]
            action_df["precision"] = (action_df["correct"] + action_df["points"]) / action_df["tries"].replace(0, 1)

            action_tables[action] = [
                schemas.PlayerActionStats(
                    setNumber=row.setNumber,
                    tries=row.tries,
                    correct=row.correct,
                    points=row.points,
                    errors=row.errors,
                    precision=row.precision
                )
                for row in action_df.itertuples()
            ]

        general_df = pd.DataFrame({
            "action": list(action_mapping.keys()),
            "correct": [df[cols[:-1]].sum().sum() for cols in action_mapping.values()],
            "points": [
                df[cols[1]].sum() if action in ["serve", "attack", "block"] else 0
                for action, cols in action_mapping.items()
            ],
            "errors": [df[cols[-1]].sum() for cols in action_mapping.values()]
        })
        general_df["tries"] = general_df["correct"] + general_df["errors"] + general_df["points"]
        general_df["precision"] = (general_df["correct"] + general_df["points"]) / general_df["tries"].replace(0, 1)

        if not previous:
            prev_query = f"""
                SELECT id FROM Match WHERE matchTime < 
                (SELECT matchTime FROM Match WHERE id = {PARAM_PLACEHOLDER}) 
                AND (team1Id = (SELECT teamId FROM Player WHERE id = {PARAM_PLACEHOLDER}) 
                OR team2Id = (SELECT teamId FROM Player WHERE id = {PARAM_PLACEHOLDER})) 
                ORDER BY matchTime DESC LIMIT 1
            """
            cursor.execute(prev_query, (match_id, player_id, player_id))
            prev_match = cursor.fetchone()

            if prev_match:
                prev_match_id = prev_match[0]
                prev_report = get_report_stats(player_id, prev_match_id, previous=True)

                for idx, current in enumerate(general_df.itertuples()):
                    general_df.at[idx, "evolution"] = current.precision - prev_report.generalStats[idx].precision

                for action in action_mapping.keys():
                    for idx, current in enumerate(action_tables[action]):
                        if idx < len(getattr(prev_report, f"{action}Stats")):
                            current.evolution = current.precision - getattr(prev_report, f"{action}Stats")[idx].precision

        general_stats = [
            schemas.PlayerMatchStats(
                action=row.action,
                tries=row.tries,
                correct=row.correct,
                points=row.points,
                errors=row.errors,
                precision=row.precision,
                evolution=row.evolution if "evolution" in row._fields else None
            )
            for row in general_df.itertuples()
        ]

        return schemas.PlayerReportResponse(
            generalStats=general_stats,
            serveStats=action_tables["serve"],
            attackStats=action_tables["attack"],
            receptionStats=action_tables["reception"],
            blockStats=action_tables["block"],
            setStats=action_tables["set"]
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Erro ao gerar relatório para jogador {player_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao gerar relatório.")
    finally:
        conn.close()
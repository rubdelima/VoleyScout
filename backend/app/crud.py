"""
Módulo CRUD para a aplicação de voleibol.
Contém funções para inserir e consultar dados no banco de dados.
As funções utilizam os esquemas definidos em schemas.py para validar e formatar os dados.
"""

from fastapi import HTTPException
from app.db import db , get_db_connection_local, get_db_connection_deploy
import uuid
import app.schemas as schemas
import pandas as pd  # type: ignore
from datetime import datetime, timezone
from typing import Optional, List
from passlib.context import CryptContext
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

PARAM_PLACEHOLDER = db.param_placeholder
DB_TYPE = db.database_type

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def add_analyzer(analyzer: schemas.AnalyzerName) -> str:
    """
    Insere um novo analizador no banco de dados.
    
    Parâmetros:
        analyzer: Objeto do tipo AnalyzerBase com os dados do analizador.
    
    Retorna:
        O ID gerado para o analizador.
    """
    conn, cursor = db.get_db_connection()
    try:
        analyzer_id = str(uuid.uuid4())
        if DB_TYPE == "DEPLOY":
            cursor.execute(
                "INSERT INTO Analyzer (id, name, nickname, password) VALUES (%s, %s, %s, %s)",
                (analyzer_id, analyzer.name, analyzer.nickname, hash_password(analyzer.password))
            )
        else:
            cursor.execute(
            "INSERT INTO Analyzer (id, name, nickname, password) VALUES (?,?,?,?)",
            (analyzer_id, analyzer.name, analyzer.nickname, hash_password(analyzer.password))
            )
        conn.commit()
        return analyzer_id
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Erro ao inserir analizador.")
    finally:
        conn.close()

def get_analyzer(analyzer: schemas.AnalyzerBase) -> schemas.AnalyzerDB:
    conn, cursor = db.get_db_connection()
    try:
        query = f"SELECT id, name, nickname, password FROM Analyzer WHERE nickname={PARAM_PLACEHOLDER}"
        cursor.execute(query, (analyzer.nickname,))
        
        row = cursor.fetchone()
        if row is None:
            print("Row not found")
            raise HTTPException(status_code=404, detail="Analizador não encontrado.")
        
        if not verify_password(analyzer.password, row[3]):
            print("Invalid password")
            raise HTTPException(status_code=401, detail="Senha inválida.")
        
        return schemas.AnalyzerDB(id=row[0], name=row[1], nickname=row[2], password=analyzer.password)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Erro ao buscar analizador.")
    finally:
        conn.close()
        
def add_team(team: schemas.TeamBase) -> str:
    """
    Insere um novo time no banco de dados.

    Parâmetros:
        team: Objeto do tipo TeamBase com os dados do time.

    Retorna:
        O ID gerado para o time.
    """
    conn, cursor = db.get_db_connection()
    team_id = str(uuid.uuid4())
    query = f"INSERT INTO Team (id, name, abbreviation) VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})"
    cursor.execute(query, (team_id, team.name, team.abbreviation))
    conn.commit()
    conn.close()
    return team_id

def get_teams()-> schemas.TeamDB:
    conn, cursor = db.get_db_connection()
    query = "SELECT id, name, abbreviation FROM Team"
    cursor.execute(query)
    teams = cursor.fetchall()
    conn.close()
    teams_db = [schemas.TeamDB(id=row[0], name=row[1], abbreviation=row[2]) for row in teams]
    return teams_db

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

def add_match(match: schemas.MatchBase) -> str:
    """
    Insere uma nova partida no banco de dados.

    Parâmetros:
        match: Objeto do tipo MatchBase com os dados da partida.
               O atributo 'isTournament' indica se a partida faz parte de um torneio.

    Retorna:
        O ID gerado para a partida.
    """
    match_id = str(uuid.uuid4())
    conn, cursor = db.get_db_connection()
    query = f"""INSERT INTO Match (id, team1Id, team2Id, matchTime, isTournament)
           VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})"""
    cursor.execute(
        query,
        (match_id, match.team1Id, match.team2Id, match.matchTime, match.isTournament)
    )
    conn.commit()
    conn.close()
    return match_id

def get_team_matches(team_id):
    #TODO
    pass

def add_set(match_set: schemas.MatchSet):
    """
    Adiciona um set para uma partida.

    Parâmetros:
        match_set: Objeto MatchSet contendo os dados do set.

    Retorna:
        Mensagem de sucesso caso o set seja adicionado.
    """
    conn, cursor = db.get_db_connection()

    try:
        # Verifica se o set já existe para essa partida
        query_check = f"""
            SELECT 1 FROM MatchSet 
            WHERE matchId = {PARAM_PLACEHOLDER} AND setNumber = {PARAM_PLACEHOLDER}
        """
        cursor.execute(query_check, (match_set.matchId, match_set.setNumber))
        existing_set = cursor.fetchone()

        if existing_set:
            raise HTTPException(status_code=409, detail="Set já existe para essa partida.")

        # Inserção do novo set
        query_insert = f"""
            INSERT INTO MatchSet (matchId, setNumber, team1, team1Points, team2, team2Points) 
            VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})
        """
        
        cursor.execute(query_insert, (
            match_set.matchId, match_set.setNumber, 
            match_set.team1, match_set.team1Points, 
            match_set.team2, match_set.team2Points
        ))

        conn.commit()
        return {"message": "Set adicionado com sucesso!"}

    except HTTPException as he:
        raise he

    except Exception as e:
        print(f"Erro ao adicionar set: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao adicionar set.")

    finally:
        conn.close()

def add_report(report: schemas.SetReport):
    """
    Adiciona um relatório de set para um jogador.

    Parâmetros:
        report: Objeto SetReport com os dados do relatório.

    Retorna:
        Mensagem de sucesso caso o relatório seja adicionado.
    """
    conn, cursor = db.get_db_connection()

    try:
        # Verificar se já existe um relatório para o jogador neste set
        query_check = f"""
            SELECT 1 FROM SetReport 
            WHERE matchId = {PARAM_PLACEHOLDER} AND playerId = {PARAM_PLACEHOLDER} AND setNumber = {PARAM_PLACEHOLDER}
        """
        cursor.execute(query_check, (report.matchId, report.playerId, report.setNumber))
        existing_report = cursor.fetchone()

        if existing_report:
            raise HTTPException(status_code=409, detail="Relatório já existe para este jogador neste set.")

        # Montar a query com placeholders adequados
        placeholders = ", ".join([PARAM_PLACEHOLDER] * 26)
        query_insert = f"""
            INSERT INTO SetReport (
                matchId, playerId, setNumber, analyzer, reportTime,
                playerInSet, hasSubs, playerIn,
                serveCorrect, servePoint, serveError,
                attackCorrect, attackPoint, attackError,
                receptionA, receptionB, receptionC, receptionError,
                blockCorrect, blockSoft, blockError,
                setA, setB, setC, setD, setError
            ) VALUES ({placeholders})
        """
        
        # Executar a inserção
        cursor.execute(query_insert, (
            report.matchId, report.playerId, report.setNumber, report.analyzer, report.reportTime,
            report.playerInSet, report.hasSubs, report.playerIn,
            report.serveCorrect, report.servePoint, report.serveError,
            report.attackCorrect, report.attackPoint, report.attackError,
            report.receptionA, report.receptionB, report.receptionC, report.receptionError,
            report.blockCorrect, report.blockSoft, report.blockError,
            report.setA, report.setB, report.setC, report.setD, report.setError
        ))

        conn.commit()
        return {"message": "Relatório adicionado com sucesso!"}

    except HTTPException as he:
        raise he

    except Exception as e:
        print(f"Erro ao adicionar relatório: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao adicionar relatório.")

    finally:
        conn.close()

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

def get_team(team_id: str) -> schemas.TeamDB:
    """
    Retorna os dados de um time a partir do seu ID.

    Parâmetros:
        team_id: ID do time.

    Retorna:
        Objeto do tipo TeamDB com os dados do time.

    Levanta:
        HTTPException (404) se o time não for encontrado.
    """
    conn, cursor = db.get_db_connection()
    query = f"SELECT id, name, abbreviation FROM Team WHERE id = {PARAM_PLACEHOLDER}"
    cursor.execute(query, (team_id,))
    team = cursor.fetchone()
    conn.close()
    if team:
        return schemas.TeamDB(id=team[0], name=team[1], abbreviation=team[2])
    raise HTTPException(status_code=404, detail="Team not found")

def get_team_players(team_id: str) -> List[schemas.PlayerTable]:
    """
    Retorna a lista de jogadores de um time, incluindo a contagem de análises para cada jogador.

    Parâmetros:
        team_id: ID do time.

    Retorna:
        Lista de objetos do tipo PlayerTable.
    """
    conn, cursor = db.get_db_connection()
    query = f"""
        SELECT p.id, p.name, p.nickname, p.position, p.number, p.height, 
               p.birthdate, p.isCaptain, COUNT(sr.playerId) AS analysis
        FROM Player p
        LEFT JOIN SetReport sr ON p.id = sr.playerId
        WHERE p.teamId = {PARAM_PLACEHOLDER}
        GROUP BY p.id
    """
    cursor.execute(query, (team_id,))
    players = cursor.fetchall()
    conn.close()
    return [
        schemas.PlayerTable(
            id=row[0], name=row[1], nickname=row[2], position=row[3], number=row[4],
            height=row[5], birthdate=row[6], isCaptain=bool(row[7]), team=team_id, analysis=row[8]
        )
        for row in players
    ]

def get_team_matches(team_id: str) -> List[schemas.MatchResponse]:
    """
    Retorna as partidas associadas a um time, calculando estatísticas como número de sets,
    sets vencidos, análise de jogadores e lista de analisadores.

    Parâmetros:
        team_id: ID do time.

    Retorna:
        Lista de objetos do tipo MatchResponse.
    """
    try:
        conn, cursor = db.get_db_connection()
        
        # Busca as partidas do time
        query = f"""
            SELECT m.id, m.team1Id, m.team2Id, m.matchTime, m.isTournament, 
                   t1.name AS team1_name, t2.name AS team2_name
            FROM Match m
            JOIN Team t1 ON m.team1Id = t1.id
            JOIN Team t2 ON m.team2Id = t2.id
            WHERE m.team1Id = {PARAM_PLACEHOLDER} OR m.team2Id = {PARAM_PLACEHOLDER}
        """
        cursor.execute(query, (team_id, team_id))
        matches = cursor.fetchall()
        
        matches_responses = []
        match_ids = tuple(m[0] for m in matches)
        
        if match_ids:
            placeholders = ", ".join([PARAM_PLACEHOLDER] * 26)
            query = f"""
                SELECT matchId, team1, team1Points, team2, team2Points 
                FROM MatchSet 
                WHERE matchId IN ({placeholders})
            """
            cursor.execute(query, match_ids)
            sets_data = cursor.fetchall()
        else:
            sets_data = []

        # Organizar sets por partida
        sets_by_match = {match_id: [] for match_id in match_ids} if match_ids else {}
        for s in sets_data:
            sets_by_match[s[0]].append(s)
        
        for match in matches:
            match_id, team1_id, team2_id, match_time, isTournament, team1_name, team2_name = match
            adversary_id, adversary_name, team_name = (
                (team2_id, team2_name, team1_name) if team1_id == team_id else (team1_id, team1_name, team2_name)
            )
            
            sets = sets_by_match.get(match_id, [])
            n_sets = len(sets)
            team_sets = sum(1 for s in sets if 
                            (s[1] == team_id and s[2] > s[4]) or 
                            (s[3] == team_id and s[4] > s[2]))
            adversary_sets = n_sets - team_sets
            win = team_sets > adversary_sets
            
            # Buscar jogadores analisados
            query = f"SELECT COUNT(DISTINCT playerId) FROM SetReport WHERE matchId = {PARAM_PLACEHOLDER}"
            cursor.execute(query, (match_id,))
            analyzed_players = cursor.fetchone()[0]
            
            # Buscar os nomes dos analisadores
            query = f"""
                SELECT DISTINCT a.name 
                FROM SetReport sr
                JOIN Analyzer a ON sr.analyzer = a.id
                WHERE sr.matchId = {PARAM_PLACEHOLDER}
            """
            cursor.execute(query, (match_id,))
            analyzers = [row[0] for row in cursor.fetchall()]
            
            matches_responses.append(schemas.MatchResponse(
                id=match_id, team1Id=team1_id, team2Id=team2_id, matchTime=match_time, isTournament=isTournament,
                team=team_name, adversary=adversary_name, nSets=n_sets, teamSets=team_sets, adversarySets=adversary_sets,
                win=win, analyzedPlayers=analyzed_players, analyzers=analyzers
            ))
        
        return matches_responses
    except Exception as e:
        print(f"Erro ao buscar partidas: {e}")
        return []
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
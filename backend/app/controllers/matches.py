from fastapi import HTTPException
from app.db import db, PARAM_PLACEHOLDER
import uuid
import app.schemas as schemas
from typing import List

def add_match(match: schemas.MatchBase) -> str:
    match_id = str(uuid.uuid4())
    conn, cursor = db.get_db_connection()

    try:
        # Insere a partida
        query = f"""INSERT INTO Match (id, team1Id, team2Id, matchTime, isTournament)
                    VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})"""
        cursor.execute(
            query,
            (match_id, match.team1Id, match.team2Id, match.matchTime, match.isTournament)
        )

        # Insere os sets (se houver)
        for s in match.sets:
            query_set = f"""INSERT INTO MatchSet (matchId, setNumber, team1, team1Points, team2, team2Points)
                            VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})"""
            cursor.execute(
                query_set,
                (match_id, s.setNumber, s.team1, s.team1Points, s.team2, s.team2Points)
            )

        conn.commit()
        return match_id

    except Exception as e:
        print("Erro ao salvar partida com sets:", e)
        conn.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar partida com sets")

    finally:
        conn.close()


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

def get_team_matches(team_id: str) -> List[schemas.MatchResponse]:
    """
    Retorna as partidas associadas a um time, com sets e estatísticas adicionais.
    """
    conn, cursor = db.get_db_connection()

    try:
        # Consulta as partidas
        query = f"""
            SELECT m.id, m.team1Id, m.team2Id, m.matchTime, m.isTournament,
                   t1.name as team1_name, t2.name as team2_name
            FROM Match m
            JOIN Team t1 ON m.team1Id = t1.id
            JOIN Team t2 ON m.team2Id = t2.id
            WHERE m.team1Id = {PARAM_PLACEHOLDER} OR m.team2Id = {PARAM_PLACEHOLDER}
        """
        cursor.execute(query, (team_id, team_id))
        matches = cursor.fetchall()

        response_list = []
        for match in matches:
            match_id, team1_id, team2_id, match_time, is_tournament, team1_name, team2_name = match

            # Busca os sets
            match_sets_raw = get_sets_for_match(match_id)
            match_sets = [schemas.MatchSet(**s.model_dump()) for s in match_sets_raw]  # Garante conversão correta

            # Estatísticas
            n_sets = len(match_sets)
            team_sets = sum(
                1 for s in match_sets
                if (s.team1 == team_id and s.team1Points > s.team2Points) or
                   (s.team2 == team_id and s.team2Points > s.team1Points)
            )
            adversary_sets = n_sets - team_sets
            win = team_sets > adversary_sets

            # Jogadores analisados
            cursor.execute("SELECT COUNT(DISTINCT playerId) FROM SetReport WHERE matchId = ?", (match_id,))
            analyzed_players = cursor.fetchone()[0]

            # Analisadores
            cursor.execute("""
                SELECT DISTINCT a.name
                FROM SetReport sr
                JOIN Analyzer a ON a.id = sr.analyzer
                WHERE sr.matchId = ?
            """, (match_id,))
            analyzers = [row[0] for row in cursor.fetchall()]

            # Identifica quem é o time e quem é o adversário
            if team1_id == team_id:
                team_name = team1_name
                adversary_name = team2_name
            else:
                team_name = team2_name
                adversary_name = team1_name

            response_list.append(schemas.MatchResponse(
                id=match_id,
                team1Id=team1_id,
                team2Id=team2_id,
                matchTime=match_time,
                isTournament=is_tournament,
                sets=match_sets,
                team=team_name,
                adversary=adversary_name,
                nSets=n_sets,
                teamSets=team_sets,
                adversarySets=adversary_sets,
                win=win,
                analyzedPlayers=analyzed_players,
                analyzers=analyzers
            ))

        return response_list

    except Exception as e:
        print(f"Erro ao buscar partidas: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar partidas.")
    finally:
        conn.close()


def get_sets_for_match(match_id: str) -> List[schemas.MatchSet]:
    """
    Retorna todos os sets associados a uma partida.
    """
    conn, cursor = db.get_db_connection()

    try:
        query = f"""
            SELECT matchId, setNumber, team1, team1Points, team2, team2Points
            FROM MatchSet
            WHERE matchId = {PARAM_PLACEHOLDER}
            ORDER BY setNumber
        """
        cursor.execute(query, (match_id,))
        sets = cursor.fetchall()

        return [
            schemas.MatchSet(
                matchId=row[0],
                setNumber=row[1],
                team1=row[2],
                team1Points=row[3],
                team2=row[4],
                team2Points=row[5]
            )
            for row in sets
        ]

    except Exception as e:
        print(f"Erro ao buscar sets da partida {match_id}: {e}")
        return []
    
    finally:
        conn.close()

from fastapi import HTTPException
from app.db import db, PARAM_PLACEHOLDER
import uuid
import app.schemas as schemas
from typing import List

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
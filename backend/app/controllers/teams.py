from fastapi import HTTPException
from app.db import db, PARAM_PLACEHOLDER
import uuid
import app.schemas as schemas
from typing import List
import traceback

def add_team(team: schemas.TeamBase) -> str:
    """
    Insere um novo time no banco de dados.

    Parâmetros:
        team: Objeto do tipo TeamBase com os dados do time.

    Retorna:
        O ID gerado para o time.
    """
    conn, cursor = db.get_db_connection()
    
    query_check = f"""
        SELECT id FROM Team 
        WHERE name = {PARAM_PLACEHOLDER} AND abbreviation = {PARAM_PLACEHOLDER}
    """
    cursor.execute(query_check, (team.name, team.abbreviation))
    existing_team = cursor.fetchone()

    if existing_team:
        return existing_team[0]
    
    team_id = str(uuid.uuid4())
    query = f"INSERT INTO Team (id, name, abbreviation) VALUES ({PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER}, {PARAM_PLACEHOLDER})"
    cursor.execute(query, (team_id, team.name, team.abbreviation))
    conn.commit()
    conn.close()
    return team_id

def get_teams()-> List[schemas.TeamDB]:
    """
    Busca todos os times do Banco de Dados

    Parâmetros:
        Não possui parâmetros

    Retorna:
        Todos os times no Banco de Dados
    """
    conn, cursor = db.get_db_connection()
    query = "SELECT id, name, abbreviation FROM Team"
    cursor.execute(query)
    teams = cursor.fetchall()
    conn.close()
    teams_db = [schemas.TeamDB(id=row[0], name=row[1], abbreviation=row[2]) for row in teams]
    return teams_db

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
            placeholders = ", ".join([PARAM_PLACEHOLDER] * len(match_ids))
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
        traceback.print_exc()
        return []
    finally:
        conn.close()
    

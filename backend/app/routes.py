"""
Arquivo de rotas da API.

Define os endpoints da aplicação, utilizando o APIRouter do FastAPI para agrupar as rotas.
Cada rota chama funções do módulo CRUD para realizar operações no banco de dados.
"""

from fastapi import APIRouter, HTTPException
from typing import List
import app.schemas as schemas
import app.crud as crud

router = APIRouter()

@router.post("/analyser", response_model =schemas.AnalyzerDB)
async def create_analyzer(analyzer: schemas.AnalyzerName):
    """
    Endpoint para criar um novo analizador.
    
    Parâmetros:
        analyzer: Objeto AnalyzerBase contendo os dados do analizador.
    
    Retorna:
        Um objeto AnalyzerDB com o ID gerado.
    """
    analyzer_id = crud.add_analyzer(analyzer)
    return schemas.AnalyzerDB(id=analyzer_id, **analyzer.model_dump())

@router.get("/analyzer", response_model=schemas.AnalyzerDB)
async def get_analyzer(analyzer:schemas.AnalyzerBase):
    """
    Endpoint para buscar um analizador a partir dos dados de entrada.
    
    Parâmetros:
        analyzer: Objeto AnalyzerBase contendo os dados do analizador.
    
    Retorna:
        Um objeto AnalyzerDB com os dados do analizador encontrado.
    """
    
    analyzer_db = crud.get_analyzer(analyzer)
    if analyzer_db is None:
        raise HTTPException(status_code=404, detail="Analizador não encontrado.")
    return analyzer_db


@router.post("/teams", response_model=schemas.TeamDB)
async def create_team(team: schemas.TeamBase):
    """
    Endpoint para criar um novo time.

    Parâmetros:
        team: Objeto TeamBase contendo os dados do time.

    Retorna:
        Um objeto TeamDB com o ID gerado.
    """
    team_id = crud.add_team(team)
    return schemas.TeamDB(id=team_id, **team.model_dump())


@router.get('/home/{team_id}', response_model=schemas.TeamResponse)
async def home(team_id: str):
    """
    Endpoint para obter os dados de um time, incluindo seus jogadores e partidas.

    Parâmetros:
        team_id: ID do time.

    Retorna:
        Um objeto TeamResponse contendo os dados do time, a lista de jogadores e as partidas associadas.
    """
    team = crud.get_team(team_id)
    players = crud.get_team_players(team_id)
    matches = crud.get_team_matches(team_id)
    
    return schemas.TeamResponse(
        **team.model_dump(),
        players=players,
        matches=matches
    )

@router.post("/players", response_model=schemas.PlayerDB)
async def create_player(player: schemas.PlayerBase):
    """
    Endpoint para criar um novo jogador.

    Parâmetros:
        player: Objeto PlayerBase com os dados do jogador.

    Retorna:
        O objeto PlayerDB com o ID gerado.
    """
    player_id = crud.add_player(player)
    new_player = schemas.PlayerDB(id=player_id, **player.model_dump())
    return new_player

@router.post("/matches", response_model=schemas.MatchDB)
async def create_match(match: schemas.MatchBase):
    """
    Endpoint para criar uma nova partida.

    Parâmetros:
        match: Objeto MatchBase com os dados da partida.

    Retorna:
        O objeto MatchDB com o ID gerado.
    """
    match_id = crud.add_match(match)
    new_match = schemas.MatchDB(id=match_id, **match.model_dump())
    return new_match

@router.post("/matches/{match_id}/sets")
async def create_set(match_id: str, match_set: schemas.MatchSet):
    """
    Endpoint para adicionar um set a uma partida.

    Parâmetros:
        match_id: ID da partida.
        match_set: Objeto MatchSet contendo os dados do set.

    Retorna:
        Mensagem de sucesso caso o set seja adicionado.
    """
    if match_set.matchId != match_id:
        raise HTTPException(status_code=400, detail="O matchId da URL não confere com o matchId do set.")

    return crud.add_set(match_set)


@router.post("/players/{player_id}/reports")
async def post_player_reports(player_id: str, set_report: schemas.SetReport):
    """
    Endpoint para adicionar um relatório de set para um jogador.

    Parâmetros:
        player_id: ID do jogador (deve ser consistente com set_report.playerId).
        set_report: Objeto SetReport com os dados do relatório.

    Retorna:
        Mensagem de sucesso caso o relatório seja adicionado.
    """
    # Opcional: Verificar se o player_id na URL confere com o playerId do set_report
    if set_report.playerId != player_id:
        raise HTTPException(status_code=400, detail="O player_id da URL não confere com o playerId do relatório.")
    return crud.add_report(set_report)

@router.get("/players/{player_id}", response_model=schemas.PlayerReports)
async def get_player_info(player_id: str):
    """
    Endpoint para obter os dados de um jogador, incluindo seus relatórios de set.

    Parâmetros:
        player_id: ID do jogador.

    Retorna:
        Um objeto PlayerReports contendo os dados do jogador e a lista de seus relatórios.
    """
    player = crud.get_player(player_id)
    reports = crud.get_player_reports(player_id)
    return schemas.PlayerReports(
        **player.model_dump(),
        reports=reports
    )

@router.get("/players/{player_id}/{match_id}/reports", response_model=List[schemas.SetReport])
async def get_player_match_reports(player_id: str, match_id: str):
    """
    Endpoint para obter os relatórios de set de um jogador em uma partida específica.

    Parâmetros:
        player_id: ID do jogador.
        match_id: ID da partida.

    Retorna:
        Lista de objetos SetReport referentes à partida.
    """
    return crud.get_player_reports(player_id, match_id)

@router.get("/players/{player_id}/{match_id}/stats", response_model=schemas.PlayerReportResponse)
async def get_player_stats(player_id: str, match_id: str):
    """
    Endpoint para obter as estatísticas de desempenho de um jogador em uma partida.

    Parâmetros:
        player_id: ID do jogador.
        match_id: ID da partida.

    Retorna:
        Um objeto PlayerReportResponse com as estatísticas gerais e por ação (serve, attack, reception, block, set).
    """
    return crud.get_report_stats(player_id, match_id)

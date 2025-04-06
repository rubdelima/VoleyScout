from fastapi import APIRouter, HTTPException
from typing import List
import app.schemas as schemas
import app.crud as crud

router = APIRouter(tags=["players"])

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
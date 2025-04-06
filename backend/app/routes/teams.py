from fastapi import APIRouter, HTTPException
from typing import List
import app.schemas as schemas
import app.controllers as crud

router = APIRouter(tags=["teams"])

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

@router.get("/teams", response_model=list[schemas.TeamDB])
async def get_teams():
    """
    Endpoint para acessar todos os times.

    Parâmetros:
        Não possui parâmetros

    Retorna:
        Uma lista de objetos TeamDB.
    """
    return crud.get_teams()


@router.get('/teams/{team_id}', response_model=schemas.TeamResponse)
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

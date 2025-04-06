from fastapi import APIRouter, HTTPException
from typing import List
import app.schemas as schemas
import app.controllers as crud

router = APIRouter(tags=["matches"])

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

@router.get("/matches/{team_id}", response_model= list[schemas.MatchDB], tags=["matches", "teams"])
async def get_team_matches(team_id: str):
    """
    Endpoint para acessar o histórico de partidas de um time
    
    Parâmetros:
        team_id: Objeto MatchBase com os dados da partida.

    Retorna:
        Uma lista de MatchDB
    """
    
    return crud.get_team_matches(team_id)

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
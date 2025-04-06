from fastapi import APIRouter, HTTPException
import app.schemas as schemas
import app.crud as crud

router = APIRouter(tags=["auth"])

@router.post("/sign_up", response_model =schemas.AnalyzerDB)
async def create_analyzer(analyzer: schemas.AnalyzerName):
    """
    Endpoint para criar um novo analizador.
    
    Parâmetros:
        analyzer: Objeto AnalyzerBase contendo os dados do analizador.
    
    Retorna:
        Um objeto AnalyzerDB com o ID gerado.
    """
    analyzer_id = crud.add_analyzer(analyzer)
    print(analyzer_id)
    return schemas.AnalyzerDB(id=analyzer_id, **analyzer.model_dump())

@router.post("/login", response_model=schemas.AnalyzerDB)
async def login_analyzer(analyzer:schemas.AnalyzerBase):
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
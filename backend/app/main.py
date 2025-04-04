"""
Arquivo principal da aplicação FastAPI.

Este arquivo inicializa o servidor e inclui as rotas definidas no módulo `routes.py`.
"""
import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from fastapi import FastAPI
import app.routes as routes
from fastapi.middleware.cors import CORSMiddleware

# Criar a aplicação FastAPI
app = FastAPI(
    title="Volleyball Stats API",
    description="API para gerenciamento de partidas, jogadores e estatísticas de voleibol.",
    version="1.0.0"
)
origins = [
    "http://localhost:3000",  # Adicionando porta do React para aceitar no uvicorn
    "http://127.0.0.1:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Quais domínios podem fazer requisições
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos os headers
)

# TODO:: Ajustar as políticas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir as rotas definidas em `routes.py`
app.include_router(routes.router)

@app.get("/")
async def root():
    """
    Rota raiz da API.

    Retorna:
        Mensagem indicando que a API está ativa.
    """
    return {"message": "Bem-vindo à Volleyball Stats API! Acesse /docs para mais detalhes."}

# Permitir execução direta com Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

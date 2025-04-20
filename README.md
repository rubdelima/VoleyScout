# VoleyScout

<div align="center">
  <img src="frontend/public/logo.png" alt="Logo VoleyScout" width="200" />
</div>

VoleyScout é uma aplicação para análise e gerenciamento de partidas e jogadores de vôlei, composta por um backend em FastAPI (Python) e um frontend em React (TypeScript + TailwindCSS).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Python](https://www.python.org/) (3.12 recomendado)
- [Docker](https://www.docker.com/) (opcional, para execução via container)

## Configuração das Variáveis de Ambiente

Antes de executar o projeto, crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias para o banco de dados. Use o arquivo `.env.example` como base:

```
DATABASE_URL= # URL de conexão com o banco de dados
DATABASE_TYPE= # LOCAL ou DEPLOY
```

Exemplo:
```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
DATABASE_TYPE=LOCAL
```

## Executando com Docker Compose

1. Certifique-se de que o arquivo `.env` está configurado corretamente na raiz do projeto.
2. Execute o comando abaixo na raiz do projeto:
   ```sh
   docker-compose up --build
   ```
   - Isso irá subir todos os serviços definidos no `docker-compose.yaml` (backend e frontend).
   - O backend estará disponível em http://localhost:8000
   - O frontend estará disponível em http://localhost:3000

## Executando Manualmente (sem Docker)

### 1. Backend (FastAPI)

1. Acesse a pasta do backend:
   ```sh
   cd backend
   ```
2. Crie e ative um ambiente virtual:
   - **Windows:**
     ```sh
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Linux/Mac:**
     ```sh
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Instale as dependências:
   ```sh
   pip install -r requirements.txt
   ```
4. Volte para a raiz do projeto e execute o backend:
   ```sh
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
   ```

### 2. Frontend (React)

1. Na raiz do projeto, instale as dependências:
   ```sh
   npm install --legacy-peer-deps
   ```
2. Execute o frontend:
   ```sh
   npm start
   ```
   O frontend estará disponível em http://localhost:3000

## Exemplos de Telas

Veja abaixo algumas telas do sistema VoleyScout:

<div align="center">
  <img src="images/home_page_matches.png" alt="Tela inicial - Partidas" width="600" />
  <br/>
  <img src="images/home_page_players.png" alt="Tela inicial - Jogadores" width="600" />
  <br/>
  <img src="images/new_match_page.png" alt="Nova Partida" width="600" />
</div>

## Observações

- Certifique-se de que o arquivo `.env` está corretamente configurado antes de iniciar o backend.
- O backend e o frontend podem ser executados juntos via Docker ou separadamente conforme instruções acima.
- Para dúvidas sobre a estrutura do banco de dados, consulte os arquivos SQL em `backend/data/`.

## Estrutura do Banco de Dados

A estrutura do banco de dados utiliza **SQLite** e segue a modelagem abaixo:

```mermaid
erDiagram
    TEAM ||--o{ PLAYER : has
    TEAM ||--o{ MATCH : plays
    PLAYER ||--o{ SETREPORT : has
    MATCH ||--o{ MATCHSET : has
    MATCH ||--o{ SETREPORT : contains

    TEAM {
        string id PK
        string name
        string abbreviation
    }

    PLAYER {
        string id PK
        string name
        string nickname
        string position
        int number
        int height
        datetime birthdate
        boolean isCaptain
        string teamId FK
    }

    MATCH {
        string id PK
        string team1Id FK
        string team2Id FK
        datetime matchTime
        boolean isTournament
    }

    MATCHSET {
        string matchId FK
        int setNumber
        string team1
        int team1Points
        string team2
        int team2Points
    }

    SETREPORT {
        string matchId FK
        string playerId FK
        int setNumber
        datetime reportTime
        string analyzer
        boolean playerInSet
        boolean hasSubs
        boolean playerIn
        int serveCorrect
        int servePoint
        int serveError
        int attackCorrect
        int attackPoint
        int attackError
        int receptionA
        int receptionB
        int receptionC
        int receptionError
        int blockCorrect
        int blockSoft
        int blockError
        int setA
        int setB
        int setC
        int setD
        int setError
    }
```

## Endpoints da API

A API expõe os seguintes endpoints:

### 🏆 Times
| Método  | Endpoint        | Descrição                         |
|---------|----------------|-----------------------------------|
| `POST`  | `/teams/`       | Criar um novo time              |
| `GET`   | `/teams/{id}`   | Obter dados de um time          |

### 🏐 Jogadores
| Método  | Endpoint              | Descrição                        |
|---------|----------------------|--------------------------------|
| `POST`  | `/players/`          | Criar um novo jogador         |
| `GET`   | `/players/{id}`      | Obter informações de um jogador |
| `GET`   | `/players/{id}/reports` | Relatórios de um jogador |

### 🎮 Partidas
| Método  | Endpoint              | Descrição                        |
|---------|----------------------|--------------------------------|
| `POST`  | `/matches/`          | Criar uma nova partida         |
| `GET`   | `/matches/{id}`      | Obter informações de uma partida |

### 📊 Relatórios
| Método  | Endpoint                          | Descrição                         |
|---------|----------------------------------|---------------------------------|
| `POST`  | `/players/{id}/reports`         | Criar um relatório de desempenho |
| `GET`   | `/players/{id}/{match_id}/stats` | Estatísticas de um jogador em uma partida |

A documentação interativa da API está disponível em:
- Swagger UI: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

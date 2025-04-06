-- Tabela Analyzer: Armazena os dados do Analisador em Questão
CREATE TABLE IF NOT EXISTS Analyzer (
    id TEXT PRIMARY KEY,                     -- Identificador único do Analisador
    name TEXT NOT NULL,                      -- Nome do Analisador
    nickname TEXT NOT NULL UNIQUE,           -- Nickname do Analisador
    password TEXT NOT NULL                  -- Senha do Analisador
);

-- Tabela Team: Armazena os dados dos times.
CREATE TABLE IF NOT EXISTS Team (
    id TEXT PRIMARY KEY,                     -- Identificador único do time
    name TEXT NOT NULL,                      -- Nome do time
    abbreviation TEXT NOT NULL               -- Abreviação do nome do time (campo renomeado de "abrev")
);

-- Tabela Player: Armazena as informações dos jogadores.
CREATE TABLE IF NOT EXISTS Player (
    id TEXT PRIMARY KEY,                     -- Identificador único do jogador
    name TEXT NOT NULL,                      -- Nome do jogador
    nickname TEXT,                           -- Apelido (opcional)
    position TEXT CHECK(position IN ('Levantador', 'Oposto', 'Ponteiro', 'Central', 'Líbero')),  -- Posição do jogador
    number INTEGER NOT NULL,                 -- Número do jogador
    height INTEGER NOT NULL,                 -- Altura do jogador
    birthdate TEXT NOT NULL,                 -- Data de nascimento (armazenada em formato ISO)
    isCaptain BOOLEAN DEFAULT 0,             -- Indica se o jogador é capitão
    teamId TEXT NOT NULL,                    -- Identificador do time ao qual o jogador pertence
    FOREIGN KEY (teamId) REFERENCES Team(id) ON DELETE CASCADE  -- Integridade referencial com Team
);

-- Tabela Match: Armazena informações sobre as partidas.
CREATE TABLE IF NOT EXISTS Match (
    id TEXT PRIMARY KEY,                     -- Identificador único da partida
    team1Id TEXT NOT NULL,                   -- Identificador do primeiro time
    team2Id TEXT NOT NULL,                   -- Identificador do segundo time
    matchTime TIMESTAMP NOT NULL,            -- Data e hora da partida
    isTournament BOOLEAN,                    -- Indica se a partida faz parte de um torneio (corrigido de "isTourneament")
    FOREIGN KEY (team1Id) REFERENCES Team(id) ON DELETE CASCADE,
    FOREIGN KEY (team2Id) REFERENCES Team(id) ON DELETE CASCADE
);

-- Tabela MatchSet: Armazena os sets de cada partida.
-- Renomeada de "Set" para "MatchSet" para evitar conflito com a palavra reservada do Python.
CREATE TABLE IF NOT EXISTS MatchSet (
    matchId TEXT NOT NULL,                           -- Identificador da partida
    setNumber INTEGER CHECK(setNumber BETWEEN 1 AND 5),  -- Número do set (entre 1 e 5)
    team1 TEXT NOT NULL,                             -- Identificador (ou nome) do time 1 para o set
    team1Points INTEGER NOT NULL,                    -- Pontos do time 1 no set
    team2 TEXT NOT NULL,                             -- Identificador (ou nome) do time 2 para o set
    team2Points INTEGER NOT NULL,                    -- Pontos do time 2 no set
    PRIMARY KEY (matchId, setNumber),                -- Chave primária composta
    FOREIGN KEY (matchId) REFERENCES Match(id) ON DELETE CASCADE
);

-- Tabela SetReport: Armazena os relatórios das estatísticas de cada set para os jogadores.
CREATE TABLE IF NOT EXISTS SetReport (
    matchId TEXT NOT NULL,                           -- Identificador da partida
    playerId TEXT NOT NULL,                          -- Identificador do jogador
    setNumber INTEGER CHECK(setNumber BETWEEN 1 AND 5),  -- Número do set
    analyzer TEXT NOT NULL,                          -- Nome do analisador
    reportTime TIMESTAMP NOT NULL,                   -- Data e hora do relatório
    
    playerInSet BOOLEAN NOT NULL,                    -- Indica se o jogador participou do set
    hasSubs BOOLEAN NOT NULL,                        -- Indica se houve substituição
    playerIn BOOLEAN,                                -- Informação opcional sobre o jogador
    
    serveCorrect INTEGER DEFAULT 0,                  -- Número de acertos no saque
    servePoint INTEGER DEFAULT 0,                    -- Pontos obtidos no saque
    serveError INTEGER DEFAULT 0,                    -- Erros no saque
    
    attackCorrect INTEGER DEFAULT 0,                 -- Número de acertos no ataque
    attackPoint INTEGER DEFAULT 0,                   -- Pontos obtidos no ataque
    attackError INTEGER DEFAULT 0,                   -- Erros no ataque
    
    receptionA INTEGER DEFAULT 0,                    -- Estatística de recepção A
    receptionB INTEGER DEFAULT 0,                    -- Estatística de recepção B
    receptionC INTEGER DEFAULT 0,                    -- Estatística de recepção C
    receptionError INTEGER DEFAULT 0,                -- Erros na recepção
    
    blockCorrect INTEGER DEFAULT 0,                  -- Número de acertos no bloqueio
    blockSoft INTEGER DEFAULT 0,                     -- Bloqueios suaves
    blockError INTEGER DEFAULT 0,                    -- Erros no bloqueio
    
    setA INTEGER DEFAULT 0,                          -- Estatística de set A
    setB INTEGER DEFAULT 0,                          -- Estatística de set B
    setC INTEGER DEFAULT 0,                          -- Estatística de set C
    setD INTEGER DEFAULT 0,                          -- Estatística de set D
    setError INTEGER DEFAULT 0,                      -- Erros no set
    
    PRIMARY KEY (matchId, playerId, setNumber),      -- Chave primária composta
    FOREIGN KEY (analyzer) REFERENCES Analyzer(id) ON DELETE CASCADE,
    FOREIGN KEY (matchId) REFERENCES Match(id) ON DELETE CASCADE,
    FOREIGN KEY (playerId) REFERENCES Player(id) ON DELETE CASCADE
);

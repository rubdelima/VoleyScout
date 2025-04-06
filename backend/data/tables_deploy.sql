-- Tabela Analyzer
CREATE TABLE IF NOT EXISTS Analyzer (
    id UUID PRIMARY KEY,                  -- Ou você pode usar SERIAL PRIMARY KEY
    name TEXT NOT NULL,
    nickname TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabela Team
CREATE TABLE IF NOT EXISTS Team (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL
);

-- Tabela Player
CREATE TABLE IF NOT EXISTS Player (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    nickname TEXT,
    position TEXT CHECK(position IN ('Levantador', 'Oposto', 'Ponteiro', 'Central', 'Líbero')),
    number INTEGER NOT NULL,
    height INTEGER NOT NULL,
    birthdate DATE NOT NULL,
    isCaptain BOOLEAN DEFAULT FALSE,
    teamId UUID NOT NULL,
    FOREIGN KEY (teamId) REFERENCES Team(id) ON DELETE CASCADE
);

-- Tabela Match
CREATE TABLE IF NOT EXISTS Match (
    id UUID PRIMARY KEY,
    team1Id UUID NOT NULL,
    team2Id UUID NOT NULL,
    matchTime TIMESTAMP NOT NULL,
    isTournament BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (team1Id) REFERENCES Team(id) ON DELETE CASCADE,
    FOREIGN KEY (team2Id) REFERENCES Team(id) ON DELETE CASCADE
);

-- Tabela MatchSet
CREATE TABLE IF NOT EXISTS MatchSet (
    matchId UUID NOT NULL,
    setNumber INTEGER CHECK(setNumber BETWEEN 1 AND 5),
    team1 TEXT NOT NULL,
    team1Points INTEGER NOT NULL,
    team2 TEXT NOT NULL,
    team2Points INTEGER NOT NULL,
    PRIMARY KEY (matchId, setNumber),
    FOREIGN KEY (matchId) REFERENCES Match(id) ON DELETE CASCADE
);

-- Tabela SetReport
CREATE TABLE IF NOT EXISTS SetReport (
    matchId UUID NOT NULL,
    playerId UUID NOT NULL,
    setNumber INTEGER CHECK(setNumber BETWEEN 1 AND 5),
    analyzer UUID NOT NULL,
    reportTime TIMESTAMP NOT NULL,
    
    playerInSet BOOLEAN NOT NULL,
    hasSubs BOOLEAN NOT NULL,
    playerIn BOOLEAN,
    
    serveCorrect INTEGER DEFAULT 0,
    servePoint INTEGER DEFAULT 0,
    serveError INTEGER DEFAULT 0,
    
    attackCorrect INTEGER DEFAULT 0,
    attackPoint INTEGER DEFAULT 0,
    attackError INTEGER DEFAULT 0,
    
    receptionA INTEGER DEFAULT 0,
    receptionB INTEGER DEFAULT 0,
    receptionC INTEGER DEFAULT 0,
    receptionError INTEGER DEFAULT 0,
    
    blockCorrect INTEGER DEFAULT 0,
    blockSoft INTEGER DEFAULT 0,
    blockError INTEGER DEFAULT 0,
    
    setA INTEGER DEFAULT 0,
    setB INTEGER DEFAULT 0,
    setC INTEGER DEFAULT 0,
    setD INTEGER DEFAULT 0,
    setError INTEGER DEFAULT 0,
    
    PRIMARY KEY (matchId, playerId, setNumber),
    FOREIGN KEY (analyzer) REFERENCES Analyzer(id) ON DELETE CASCADE,
    FOREIGN KEY (matchId) REFERENCES Match(id) ON DELETE CASCADE,
    FOREIGN KEY (playerId) REFERENCES Player(id) ON DELETE CASCADE
);
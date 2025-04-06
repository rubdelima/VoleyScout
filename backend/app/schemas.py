"""
Schemas for database models and API input/output.

This file defines the Pydantic models for the application, ensuring
consistent data validation and serialization between the database and API.
"""

from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime
# ------------------------------------------------------------------------------
# Report Statistics Schemas
# ------------------------------------------------------------------------------

class AnalyzerBase(BaseModel):
    """
    Base schema for an analyzer. Represents the input data for creating/updating an analyzer.
    """
    nickname : str
    password: str

class AnalyzerName(AnalyzerBase):
    name: str

class AnalyzerDB(AnalyzerName):
    """
    Schema for an analyzer as stored in the database.
    """
    id: str

# ------------------------------------------------------------------------------
# Player Schemas
# ------------------------------------------------------------------------------

class PlayerBase(BaseModel):
    """
    Base schema for a player. Represents the input data for creating/updating a player.
    """
    name: str
    nickname: Optional[str] = None
    position: Literal["Levantador", "Oposto", "Ponteiro", "Central", "Libero"]
    number: int
    height: int
    birthdate: datetime
    isCaptain: bool = False
    team: str  # This corresponds to the teamId in the database

class PlayerDB(PlayerBase):
    """
    Schema for a player as stored in the database.
    """
    id: str 

class PlayerTable(PlayerDB):
    """
    Schema for displaying a player along with analysis statistics.
    """
    analysis: int = 0

# ------------------------------------------------------------------------------
# Match Set Schema
# ------------------------------------------------------------------------------

class MatchSet(BaseModel):
    """
    Schema for a match set.
    
    Note: We use 'MatchSet' instead of 'Set' to avoid conflict with Python's built-in set.
    The setNumber indicates the set's order within a match (from 1 to 5).
    """
    matchId: str
    setNumber: Literal[1, 2, 3, 4, 5]
    
    team1: str
    team1Points: int
    
    team2: str
    team2Points: int

# ------------------------------------------------------------------------------
# Match Schemas
# ------------------------------------------------------------------------------

class MatchBase(BaseModel):
    """
    Base schema for a match.
    """
    team1Id: str
    team2Id: str
    matchTime: datetime
    isTournament: bool = False  # Corrected spelling from "isTourneament"

class MatchDB(MatchBase):
    """
    Schema for a match as stored in the database.
    """
    id: str

class MatchResponse(MatchDB):
    """
    Schema for match responses including additional computed fields.
    """
    team: str                # Name of the team for which the response is generated
    adversary: str           # Name of the opposing team
    nSets: int = 0           # Total number of sets in the match
    teamSets: int = 0        # Number of sets won by the team
    adversarySets: int = 0   # Number of sets won by the adversary
    win: bool                # True if the team won the match
    analyzedPlayers: int = 0 # Number of unique players analyzed in the match
    analyzers: List[str] = []  # List of unique analyzer names

# ------------------------------------------------------------------------------
# Team Schemas
# ------------------------------------------------------------------------------

class TeamBase(BaseModel):
    """
    Base schema for a team.
    """
    name: str
    abbreviation: str  # Changed from "abrev" to "abbreviation"

class TeamDB(TeamBase):
    """
    Schema for a team as stored in the database.
    """
    id: str

class TeamResponse(TeamDB):
    """
    Schema for team responses including associated players and matches.
    """
    players: List[PlayerTable]
    matches: List[MatchResponse]

# ------------------------------------------------------------------------------
# SetReport Schemas
# ------------------------------------------------------------------------------

class SetReport(BaseModel):
    """
    Schema for reporting the statistics of a single set for a player.
    """
    matchId: str
    playerId: str
    setNumber: Literal[1, 2, 3, 4, 5]
    
    reportTime: datetime
    analyzer: str
    
    playerInSet: bool
    hasSubs: bool
    playerIn: Optional[bool] = None
    
    serveCorrect: int = 0
    servePoint: int = 0
    serveError: int = 0
    
    attackCorrect: int = 0
    attackPoint: int = 0
    attackError: int = 0
    
    receptionA: int = 0
    receptionB: int = 0
    receptionC: int = 0
    receptionError: int = 0
    
    blockCorrect: int = 0
    blockSoft: int = 0
    blockError: int = 0
    
    setA: int = 0
    setB: int = 0
    setC: int = 0
    setD: int = 0
    setError: int = 0

class PlayerReports(PlayerDB):
    """
    Schema for a player with an attached list of set reports.
    """
    reports: List[SetReport]

# ------------------------------------------------------------------------------
# Report Statistics Schemas
# ------------------------------------------------------------------------------

class PlayerActionStats(BaseModel):
    """
    Schema for statistics of a single action (e.g., serve, attack) for a given set.
    """
    setNumber: int
    tries: int
    correct: int
    points: int
    errors: int
    precision: float
    evolution: Optional[float] = None 

class PlayerMatchStats(BaseModel):
    """
    Schema for aggregated statistics of a single action across a match.
    """
    action: str
    tries: int
    correct: int
    points: int
    errors: int
    precision: float
    evolution: Optional[float] = None 

class PlayerReportResponse(BaseModel):
    """
    Schema for the overall player report in a match,
    including both general and action-specific statistics.
    """
    generalStats: List[PlayerMatchStats]
    serveStats: List[PlayerActionStats]
    attackStats: List[PlayerActionStats]
    receptionStats: List[PlayerActionStats]
    blockStats: List[PlayerActionStats]
    setStats: List[PlayerActionStats]

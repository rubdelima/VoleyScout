"""
Módulo CRUD para a aplicação de voleibol.
Contém funções para inserir e consultar dados no banco de dados.
As funções utilizam os esquemas definidos em schemas.py para validar e formatar os dados.
"""

from app.controllers.analyzer import add_analyzer, get_analyzer
from app.controllers.matches import add_match, add_set, add_report
from app.controllers.players import add_player, get_player, get_player_reports, get_report_stats
from app.controllers.teams import add_team, get_teams, get_team, get_team_players, get_team_matches
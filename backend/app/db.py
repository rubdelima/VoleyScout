import os
from dotenv import load_dotenv
import sqlite3
import psycopg2
import traceback

load_dotenv()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TABLES_LOCAL = os.path.join(BASE_DIR, "data", "tables_local.sql")
TABLES_DEPLOY = os.path.join(BASE_DIR, "data", "tables_deploy.sql")
DB_NAME = os.path.join(BASE_DIR, "data", "volleyball.db")
DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_TYPE = os.getenv("DATABASE_TYPE")

def get_db_connection_local():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Permite acessar colunas pelo nome
    cursor = conn.cursor()
    return conn, cursor

def get_db_connection_deploy():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    return conn, cursor

class DBConnection:
    def __init__(self):        
        if DATABASE_TYPE == "DEPLOY" and DATABASE_URL is not None:
            print("Connecting to deploy database...")
            try:
                self.load_tables_deploy()
                print("Connected to deploy database.")
            except Exception as e:
                self.get_db_connection = None
                print(f"Error connecting to deploy database: {e}")
                self.load_tables_local()
        else:
            self.load_tables_local()
            
    def load_tables_deploy(self):
        conn, cursor = get_db_connection_deploy()
        
        with open(TABLES_DEPLOY, "r") as file:
            sql_script = file.read()
            
        commands = sql_script.split(';')
        for command in commands:
            if command.strip():
                cursor.execute(command)
        
        conn.commit()
        conn.close()
        self.param_placeholder = "%s"
        self.database_type = "DEPLOY"
        self.get_db_connection = get_db_connection_deploy
        print("Deploy tables loaded successfully.")
    
    def load_tables_local(self):
        try:
            with open(TABLES_LOCAL, "r") as file:
                sql_script = file.read()
                
            conn, cursor = get_db_connection_local()
            cursor.executescript(sql_script)
            conn.commit()
            conn.close()
            self.get_db_connection = get_db_connection_local
            self.param_placeholder = "?"
            self.database_type = "LOCAL"
            print("Connected to local database.")
        
        except Exception as e:
            print(f"Error connecting to local database: {e}")
            traceback.print_exc()
            exit(1)
            self.get_db_connection = None

db = DBConnection()
PARAM_PLACEHOLDER = db.param_placeholder
import os
import sqlite3

base_dir = os.path.join(os.getcwd(), "backend")
DB_NAME = os.path.join(base_dir, "data", "volleyball.db")
TABLES = os.path.join(base_dir, "data", "tables.sql")

"./data/volleyball.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    return conn, cursor

with open(TABLES, "r") as file:
    sql_script = file.read()

conn, cursor = get_db_connection()
cursor.executescript(sql_script)
conn.commit()
conn.close()

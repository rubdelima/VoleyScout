from fastapi import HTTPException
from app.db import db
import uuid
import app.schemas as schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

PARAM_PLACEHOLDER = db.param_placeholder
DB_TYPE = db.database_type

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def add_analyzer(analyzer: schemas.AnalyzerName) -> str:
    """
    Insere um novo analizador no banco de dados.
    
    Parâmetros:
        analyzer: Objeto do tipo AnalyzerBase com os dados do analizador.
    
    Retorna:
        O ID gerado para o analizador.
    """
    conn, cursor = db.get_db_connection()
    try:
        analyzer_id = str(uuid.uuid4())
        if DB_TYPE == "DEPLOY":
            cursor.execute(
                "INSERT INTO Analyzer (id, name, nickname, password) VALUES (%s, %s, %s, %s)",
                (analyzer_id, analyzer.name, analyzer.nickname, hash_password(analyzer.password))
            )
        else:
            cursor.execute(
            "INSERT INTO Analyzer (id, name, nickname, password) VALUES (?,?,?,?)",
            (analyzer_id, analyzer.name, analyzer.nickname, hash_password(analyzer.password))
            )
        conn.commit()
        return analyzer_id
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Erro ao inserir analizador.")
    finally:
        conn.close()

def get_analyzer(analyzer: schemas.AnalyzerBase) -> schemas.AnalyzerDB:
    conn, cursor = db.get_db_connection()
    try:
        query = f"SELECT id, name, nickname, password FROM Analyzer WHERE nickname={PARAM_PLACEHOLDER}"
        cursor.execute(query, (analyzer.nickname,))
        
        row = cursor.fetchone()
        if row is None:
            print("Row not found")
            raise HTTPException(status_code=404, detail="Analizador não encontrado.")
        
        if not verify_password(analyzer.password, row[3]):
            print("Invalid password")
            raise HTTPException(status_code=401, detail="Senha inválida.")
        
        return schemas.AnalyzerDB(id=row[0], name=row[1], nickname=row[2], password=analyzer.password)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Erro ao buscar analizador.")
    finally:
        conn.close()
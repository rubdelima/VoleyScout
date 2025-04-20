# Use uma imagem oficial do Python como base
FROM python:3.12-slim

# Define o diretório de trabalho como /app
WORKDIR /app

# Copia apenas os arquivos necessários para instalar as dependências
COPY requirements.txt ./

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código da aplicação para o container
COPY app/ ./app/
COPY data/ ./data/

# Expõe a porta padrão do FastAPI
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

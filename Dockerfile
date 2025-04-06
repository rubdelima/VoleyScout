# Etapa 1: Imagem base para o backend (Python + FastAPI)
FROM python:3.12-slim AS backend

# Set working directory
WORKDIR /app

# Copia os arquivos de requirements do backend
COPY backend/requirements.txt /app/backend/requirements.txt

# Instala as dependências do backend
RUN pip install -r /app/backend/requirements.txt

# Copia o código do backend
COPY backend /app/backend

# Etapa 2: Imagem base para o frontend (Node.js)
FROM node:22.14 AS frontend

# Set working directory para o frontend
WORKDIR /app

# Copia os arquivos de package.json e package-lock.json do frontend
COPY package.json package-lock.json /app/

# Instala as dependências do frontend
RUN npm install --legacy-peer-deps

# Copia o código do frontend para o contêiner
COPY . /app/

# Etapa 3: Imagem final - combina o backend e o frontend
FROM python:3.12-slim

# Instala dependências para rodar o backend e o frontend juntos
WORKDIR /app

# Copia os arquivos de backend e frontend
COPY --from=frontend /app /app
COPY --from=backend /app/backend /app/backend

# Exponha a porta 8000 para o backend FastAPI
EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 & npm start"]
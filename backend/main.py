from fastapi import FastAPI
from app import api
from app.database import SessionLocal

app = FastAPI()
app.include_router(api.router, prefix="/api")

# Ajouter le middleware pour gérer les requêtes CORS


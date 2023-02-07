from fastapi import FastAPI
from app import api
from starlette.middleware.cors import CORSMiddleware
from app.database import SessionLocal

app = FastAPI()
app.include_router(api.router, prefix="/api")

# Ajouter le middleware pour gérer les requêtes CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def db_session_middleware(request, call_next):
    response = None
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response
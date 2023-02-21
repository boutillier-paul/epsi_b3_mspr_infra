from fastapi import FastAPI
from app import api
from app.database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(api.router, prefix="/api")

origins = [
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET, POST, PUT, DELETE, OPTIONS, PATCH"],
    allow_headers=["*"],
)



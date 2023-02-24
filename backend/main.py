"""
    MAIN
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import api
from app.models import Role, Base
from app.database import SessionLocal, engine


app = FastAPI()
app.include_router(api.router, prefix="/api")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add default data if not already set
db = SessionLocal()
Base.metadata.create_all(bind=engine)
if not db.query(Role).all():
    db_user = Role(name = "USER")
    db_botanist = Role(name = "BOTANIST")
    db_admin = Role(name = "ADMIN")

    db.add(db_user)
    db.add(db_botanist)
    db.add(db_admin)
    db.commit()
db.close()

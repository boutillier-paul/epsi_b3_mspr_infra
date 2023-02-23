#!/bin/sh

# Make migrations
alembic revision --autogenerate -m "init db"
alembic upgrade head

# Run app
uvicorn main:app --host 0.0.0.0 --port 80
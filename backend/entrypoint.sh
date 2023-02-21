#!/bin/sh

# Make migrations
alembic upgrade head

# Run app
uvicorn main:app --host 0.0.0.0
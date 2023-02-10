# base image
FROM python:3.11-alpine

# set working directory
WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy application code
COPY . .

# set environment variables
ENV PYTHONUNBUFFERED 1

# alembic script
CMD ["alembic", "revision", "-m", '"init tables"', "--autogenerate"]
CMD ["alembic", "upgrade", "head"]

# run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
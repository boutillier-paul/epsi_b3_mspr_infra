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

# run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
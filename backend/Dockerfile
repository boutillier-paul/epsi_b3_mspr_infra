# base image
FROM python:3.11-alpine

# set environment variables
ENV PYTHONUNBUFFERED 1
ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

WORKDIR /backend

# install dependencies
COPY ./requirements.txt /backend/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

# copy application code
COPY . /backend
COPY entrypoint.sh /backend/entrypoint.sh

# Entrypoint
RUN chmod 777 ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]

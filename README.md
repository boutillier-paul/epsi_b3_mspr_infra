
# epsi_b3_mspr_infra

Backend du projet MSPR infra.


## Authors

- [@Boutillier-paul](https://github.com/Boutillier-paul)
- [@Alexis-Looten](https://github.com/Alexis-Looten)


## Installation

add .env file in the current file and add this for a local environnement

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"


POSTGRES_USER="postgres"
POSTGRES_PASSWORD="admin123"
POSTGRES_DB="arosaje"

and run 

docker compose up --build 

to lanch the app with db

go to https://localhost:8000/docs/

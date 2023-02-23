
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


----------------------------------------------------------

### Préparer son environnement

Installer le paquet virtualenv

> pip install virtualenv

Créer l'environnement virtuel

> python -m virtualenv venv

venv correspond au chemin/dossier dans lequel sera activé votre environnement virtuel
(Dans notre cas, dans le dossier où est exécuté la commande, dans le dossier venv)

Activer l'environnement virtuel

> Linux/Mac : source venv/bin/activate
> Windows : ./venv/Scripts/activate.ps1

Si sur windows vous ne pouvez exécuter le script en .ps1, ouvrer un powershelle en admin et exécuter
> set-executionpolicy unrestricted

Installer les paquets

> pip install -r requirements.txt

#### Démarrer l'application

> uvicorn main:app
> --reload # pour développer (recharge automatique l'application à chaque changement d'un fichier)

Exécuter dans le dossier application

#### Pytest

> python -m pytest

#### Coverage

> coverage run -m pytest --profile # remplace la commande python
> coverage html # génère le rapport en html

Exécuter à la racine du dossier

#### Locust

> locust # nécessite d'avoir un fichier locustfile.py dans le dossier où la commande est exécuté
> locust --config=.locust.conf

#### Pylint

> pylint application/ tests/
"""
    CONTROLLERS
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Header
from . import models, schemas, security

# USER
def get_user(database: Session, user_id: int):
    """
        get_user
    """
    return database.query(models.User).filter(models.User.id == user_id).first()

def get_users(database: Session, skip: int = 0, limit: int = 100):
    """
        get_users
    """
    return database.query(models.User).offset(skip).limit(limit).all()

def get_botanists(database: Session, skip: int = 0, limit: int = 100):
    """
        get_botanists
    """
    return database\
        .query(models.User.id, models.User.first_name, models.User.last_name, models.User.email)\
        .filter(models.User.role_id >= 2).offset(skip).limit(limit).all()

def get_user_by_email(database: Session, user_email: str):
    """
        get_user_by_email
    """
    return database.query(models.User).filter(models.User.email == user_email).first()

def get_user_by_login(database: Session, user_login: str):
    """
        get_user_by_login
    """
    return database.query(models.User).filter(models.User.login == user_login).first()

def update_user(database: Session, user: schemas.User, user_id: int):
    """
        update_user
    """
    database_user = get_user(database, user_id=user_id)
    if database_user:
        database_user = user
        database.add(database_user)
        database.commit()
    return database_user

def update_user_role(database: Session, role_id: int, user_id: int):
    """
        update_user_role
    """
    database_user = get_user(database, user_id=user_id)
    if database_user:
        database_user.role_id = role_id
        database.add(database_user)
        database.commit()
    return database_user

def create_user(database: Session, user: schemas.UserCreate):
    """
        create_user
    """
    hashed_password = security.get_password_hash(user.password)
    database_user = models.User(
        last_name   = user.last_name,
        first_name  = user.first_name,
        email       = user.email,
        login       = user.login,
        password    = hashed_password,)
    database.add(database_user)
    database.commit()
    database.refresh(database_user)
    return database_user


# ROLE
def get_role(database: Session, role_id: int):
    """
        get_role
    """
    return database.query(models.Role).filter(models.Role.id == role_id).first()

def get_role_by_name(database: Session, role_name: str):
    """
        get_role_by_name
    """
    return database.query(models.Role).filter(models.Role.name == role_name).first()

def check_user_role(database: Session, role_name: str, authorization: str = Header(None)) -> None:
    """
        check_user_role
    """
    if not authorization:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Unauthorized"
        )

    token = authorization.split(" ")[1]
    decoded_token = security.decode_jwt(token)
    if not decoded_token:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Token expired"
        )

    database_role = get_role_by_name(database, role_name=role_name)
    database_user = get_user_by_login(database, user_login=decoded_token['user_login'])

    if not database_role.id <= database_user.role_id:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = f"Unauthorized: only { database_role.name }S can access this ressource"
        )

def get_current_user(database: Session, authorization: str = Header(None)) -> None:
    """
        get_current_user
    """
    if not authorization:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Unauthorized"
        )

    token = authorization.split(" ")[1]
    decoded_token = security.decode_jwt(token)
    if not decoded_token:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail      = "Token expired"
        )
    database_user = get_user_by_login(database, user_login=decoded_token['user_login'])

    if not database_user:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail      = "This request failed"
        )

    return database_user




# PLANT
def get_plant(database: Session, plant_id: int):
    """
        get_plant
    """
    return database.query(models.Plant).filter(models.Plant.id == plant_id).first()

def get_plants(database: Session, skip: int = 0, limit: int = 100):
    """
        get_plants
    """
    return database.query(models.Plant).offset(skip).limit(limit).all()

def get_plants_by_name(database: Session, plant_name: str):
    """
        get_plants_by_name
    """
    return database.query(models.Plant)\
        .filter(models.func.lower(models.Plant.name).startswith(plant_name.lower())).all()

def get_plant_by_photo(database: Session, plant_photo: str):
    """
        get_plant_by_photo
    """
    return database.query(models.Plant).filter(models.Plant.photo == plant_photo).first()

def create_plant(database: Session, plant: schemas.PlantCreate, user_id: int):
    """
        create_plant
    """
    database_plant = models.Plant(
        name    = plant.name,
        species = plant.species, 
        photo   = plant.photo,
        pos_lat = plant.pos_lat,
        pos_lng = plant.pos_lng,
        user_id = user_id)
    database.add(database_plant)
    database.commit()
    database.refresh(database_plant)
    return database_plant

def delete_plant(database: Session, plant_id: int):
    """
        delete_plant
    """
    database_plant = database.query(models.Plant).filter(models.Plant.id == plant_id).first()
    database.delete(database_plant)
    database.commit()
    return database_plant


# GUARD
def get_guard(database: Session, guard_id:int):
    """
        get_guard
    """
    return database.query(models.Guard).filter(models.Guard.id == guard_id).first()

def get_guards(database: Session, skip:int = 0, limit: int = 100):
    """
        get_guards
    """
    return database.query(models.Guard).offset(skip).limit(limit).all()

def get_open_guards(database: Session, skip:int = 0, limit: int = 100):
    """
        get_open_guards
    """
    return database.query(models.Guard).filter(models.Guard.user_id.is_(None))\
        .offset(skip).limit(limit).all()

def create_guard(database: Session, guard: schemas.GuardCreate, plant_id: int):
    """
        create_guard
    """
    database_guard = models.Guard(
        start_at    = guard.start_at,
        end_at      = guard.end_at,
        plant_id    = plant_id)
    database.add(database_guard)
    database.commit()
    database.refresh(database_guard)
    return database_guard

def take_guard(database: Session, guard_id: int, user_id: int):
    """
        take_guard
    """
    database_guard = database.query(models.Guard).filter(models.Guard.id == guard_id).first()
    database_guard.user_id = user_id
    database.add(database_guard)
    database.commit()
    return database_guard

def cancel_guard(database: Session, guard_id: int):
    """
        cancel_guard
    """
    database_guard = database.query(models.Guard).filter(models.Guard.id == guard_id).first()
    database_guard.user_id = None
    database.add(database_guard)
    database.commit()
    return database_guard

def delete_guard(database: Session, guard_id: int):
    """
        delete_guard
    """
    database_guard = database.query(models.Guard).filter(models.Guard.id == guard_id).first()
    database.delete(database_guard)
    database.commit()
    return database_guard

#CARE SESSION
def get_care_session(database: Session, care_session_id: int):
    """
        get_care_session
    """
    return database.query(models.CareSession)\
        .filter(models.CareSession.id == care_session_id).first()

def get_care_sessions(database: Session, skip: int = 0, limit: int = 100):
    """
        get_care_sessions
    """
    return database.query(models.CareSession)\
        .order_by(models.CareSession.created_at.desc()).offset(skip).limit(limit).all()

def get_care_session_by_photo(db: Session, care_session_photo: str):
    return db.query(models.Care_Session).filter(models.Care_Session.photo == care_session_photo).first()

def create_care_session(database: Session, care_session: schemas.CareSessionCreate, guard_id: int):
    """
        create_care_session
    """
    database_care_session = models.CareSession(
        photo       = care_session.photo,
        report      = care_session.report,
        guard_id    = guard_id)
    database.add(database_care_session)
    database.commit()
    database.refresh(database_care_session)
    return database_care_session

# MESSAGE
def get_message(database: Session, message_id: int):
    """
        get_message
    """
    return database.query(models.Message).filter(models.Message.id == message_id).first()

def get_messages(database: Session, skip:int = 0, limit: int = 100):
    """
        get_messages
    """
    return database.query(models.Message).order_by(models.Message.created_at.desc())\
        .offset(skip).limit(limit).all()

def get_messages_by_sender(database: Session, sender_id: int):
    """
        get_messages_by_sender
    """
    return database.query(models.Message).filter(models.Message.sender_id == sender_id).all()

def get_messages_by_reciever(database: Session, reciever_id: int):
    """
        get_messages_by_reciever
    """
    return database.query(models.Message).filter(models.Message.reciever_id == reciever_id).all()

def get_messages_conversation(database: Session, user_id: int, interlocutor_id: int):
    """
        get_messages_conversation
    """
    return database.query(models.Message).filter(
            ((models.Message.sender_id == user_id)\
                & (models.Message.reciever_id == interlocutor_id)) |
            ((models.Message.sender_id == interlocutor_id)\
                & (models.Message.reciever_id == user_id))
        ).order_by(models.Message.created_at.desc()).all()

def create_message(database: Session, message: schemas.MessageCreate, sender_id: int,\
    reciever_id: int):
    """
        create_message
    """
    database_message = models.Message(
        content     = message.content,
        sender_id   = sender_id,
        reciever_id = reciever_id)
    database.add(database_message)
    database.commit()
    database.refresh(database_message)
    return database_message

# ADVICE
def get_advice(database: Session, advice_id: int):
    """
        get_advice
    """
    return database.query(models.Advice).filter(models.Advice.id == advice_id).first()

def get_advices(database: Session, skip: int = 0, limit: int = 100):
    """
        get_advices
    """
    return database.query(models.Advice).order_by(models.Advice.created_at.desc())\
        .offset(skip).limit(limit).all()

def get_advices_by_title(database: Session, advice_title: str):
    """
        get_advices_by_title
    """
    return database.query(models.Advice).filter(models.func.lower(models.Advice.title)\
        .startswith(advice_title.lower())).all()

def get_advice_by_photo(db: Session, advice_photo: str):
    return db.query(models.Advice).filter(models.Advice.photo == advice_photo).first()


def create_advice(database: Session, advice: schemas.AdviceCreate, user_id: int):
    """
        create_advice
    """
    database_advice = models.Advice(
        title   = advice.title,
        content = advice.content,
        photo   = advice.photo,
        user_id = user_id)
    database.add(database_advice)
    database.commit()
    database.refresh(database_advice)
    return database_advice

def update_advice(database: Session, advice: schemas.AdviceUpdate, advice_id: int):
    """
        update_advice
    """
    database_advice = database.query(models.Advice).filter(models.Advice.id == advice_id).first()
    database_advice.title     = advice.title
    database_advice.content   = advice.content
    database.add(database_advice)
    database.commit()
    return database_advice

def delete_advice(database: Session, advice_id: int):
    """
        delete_advice
    """
    database_advice = database.query(models.Advice).filter(models.Advice.id == advice_id).first()
    database.delete(database_advice)
    database.commit()
    return database_advice

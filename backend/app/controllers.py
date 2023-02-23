from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Header
from . import models, schemas, security

# USER
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user_by_email(db: Session, user_email: str):
    return db.query(models.User).filter(models.User.email == user_email).first()

def get_user_by_login(db: Session, user_login: str):
    return db.query(models.User).filter(models.User.login == user_login).first()

def update_user(db: Session, user: schemas.User):
    db_user = get_user(db, user.id)

    if db_user:
        db_user = user
        db.commit()
        db.refresh(db_user)

    return db_user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        last_name=user.last_name,
        first_name=user.first_name,
        email=user.email,
        login=user.login,
        password=hashed_password,)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ROLE
def get_role(db: Session, role_id: int):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_role_by_name(db: Session, role_name: str):
    return db.query(models.Role).filter(models.Role.name == role_name).first()

def check_user_role(db: Session, role_name: str, Authorization: str = Header(None)) -> None:
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )

    db_role = get_role_by_name(db, role_name=role_name)
    db_user = get_user_by_login(db, user_login=decoded_token['user_login'])

    if not db_role.id == db_user.role_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail= f"Unauthorized: only { db_role.name }S can access this ressource"
        )


# PLANT
def get_plant(db: Session, plant_id: int):
    return db.query(models.Plant).filter(models.Plant.id == plant_id).first()

def get_plants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Plant).offset(skip).limit(limit).all()

def get_plant_by_name(db: Session, plant_name: str):
    return db.query(models.Plant).filter(models.Plant.name == plant_name.lower).first()

def create_plant(db: Session, plant: schemas.PlantCreate, user_id: int):
    db_plant = models.Plant(
        name=plant.name,
        spicies=plant.species, 
        photo=plant.photo,
        pos_lat=plant.pos_lat,
        pos_lng=plant.pos_lng,
        user_id=user_id)
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant


# GUARD
def get_guard(db: Session, guard_id:int):
    return db.query(models.Guard).filter(models.Guard.id == guard_id).first()

def get_guards(db: Session, skip:int = 0, limit: int = 100):
    return db.query(models.Guard).offset(skip).limit(limit).all()
    
def create_guard(db: Session, guard: schemas.GuardCreate, plant_id: int):
    db_guard = models.Guard(
        start_at = guard.start_at,
        end_at = guard.end_at,
        plant_id = plant_id)
    db.add(db_guard)
    db.commit()
    db.refresh(db_guard)
    return db_guard

def accept_guard(db: Session, guard_id: int, user_id: int):
    db_guard = get_guard(db, guard_id)

    if db_guard:
        db_guard.user_id = user_id
        db.commit()
        db.refresh(db_guard)
    return db_guard


#CARE SESSION 
def get_care_session(db: Session, care_session_id: int):
   return db.query(models.Care_Session).filter(models.Care_Session.id == care_session_id).first()

def get_care_sessions(db: Session, skip: int = 0, limit: int = 100):
   return db.query(models.Care_Session).offset(skip).limit(limit).order_by(models.Care_Session.created_at.desc()).all()

def create_care_session(db: Session, care_session: schemas.CareSessionCreate, guard_id: int):
    db_care_session = models.CareSession( 
        photo = care_session.photo,
        report = care_session.report,
        guard_id = guard_id)
    db.add(db_care_session)
    db.commit()
    db.refresh(db_care_session)
    return db_care_session 


# MESSAGE
def get_messages(db: Session, message_id: int):
    return db.query(models.Message).filter(models.Message.id == message_id).first()

def get_messages_by_sender(db: Session, sender_id: int):
    return db.query(models.Message).filter(models.Message.sender_id == sender_id).all()

def get_messages_by_reciever(db: Session, reciever_id: int):
    return db.query(models.Message).filter(models.Message.reciever_id == reciever_id).all()

def get_messages_conversation(db: Session, sender_id: int, reciever_id: int):
    return db.query(models.Message).filter((models.Message.sender_id == sender_id, models.Message.reciever_id == reciever_id)\
                                        | (models.Message.sender_id == reciever_id, models.Message.reciever_id == sender_id))\
        .order_by(models.Message.created_at.desc()).all()

def create_message(db: Session, message: schemas.MessageCreate, sender_id: int, reciever_id: int):
    db_message = models.Message(
        content= message.content, 
        sender_id=sender_id, 
        reciever_id=reciever_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
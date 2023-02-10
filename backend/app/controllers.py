from sqlalchemy.orm import Session
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
        password=hashed_password,
        city=user.city,
        num_adress=user.num_adress,
        street=user.street,
        code=user.code,
        phone=user.phone)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#def delete_user(db: Session, user_id : int ):
#    db_user = db.query(models.user).filter(models.user.id ==  user_id).first()
#    db.delete(db_user)
#    db.commit()
#    return db_user

# ROLE
def get_role(db: Session, role_id: int):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_role_by_name(db: Session, role_name: str):
    return db.query(models.Role).filter(models.Role.name == role_name).first()

# PLANT
def get_plant(db: Session, plant_id: int):
    return db.query(models.Plant).filter(models.Plant.id == plant_id).filter()

def get_plants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Plant).offset(skip).limit(limit).all()

def get_plant_by_name(db: Session, plant_name: int):
    return db.query(models.Plant).filter(models.Plant.name == plant_name).first()

def create_plant(db: Session, plant: schemas.PlantCreate):
    db_plant = models.Plant(name=plant.name, spicies=plant.species, photo=plant.photo, user_id=plant.user_id)
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant



# GUARD

def get_guard(db: Session, guard_id:int):
    return db.query(models.Guard).filter(models.Guard.id == guard_id).first()

def get_guard_by_user_id(db: Session,user_id:int):
    return db.query(models.Guard).filter(models.Guard.user_id == user_id).first()

def get_guard_by_plant_id(db: Session,plant_id:int):
    return db.query(models.Guard).filter(models.Guard.plant_id == plant_id).first()

def get_guards(db: Session, skip:int = 0, limit: int = 100):
    return db.query(models.Guard).offset(skip).limit(limit).all()
    
def create_guard(db: Session, guard: schemas.GuardCreate):
    db_guard = models.Guard(plant_id = guard.plant_id, user_id = guard.user_id)
    db.add(db_guard)
    db.commit()
    db.refresh(db_guard)
    return db_guard


#CARE SESSION 
def get_care_session(db: Session, care_session_id: int):
   return db.query(models.Care_Session).filter(models.Care_Session.id == care_session_id).first()

def get_care_session_guard_id(db : Session, guard_id: int):
    return db.query(models.Care_Session).filter(models.Care_Session.guard_id == guard_id).first()

def get_care_sessions(db: Session, skip: int = 0, limit: int = 100):
   return db.query(models.Care_Session).offset(skip).limit(limit).all()

def create_care_session(db: Session, care_session: schemas.CareSessionCreate):
    db_care_session = models.CareSession(guard_id = care_session.guard_id, photo = care_session.photo)
    db.add(db_care_session)
    db.commit()
    db.refresh(db_care_session)
    return db_care_session


# MESSAGE
def get_message(db: Session, message_id: int):
    return db.query(models.Message).filter(models.Message.id == message_id).first()

def get_message_by_sender(db: Session, sender_id: int):
    return db.query(models.Message).filter(models.Message.sender_id == sender_id).all()

def get_message_by_reciever(db: Session, reciever_id: int):
    return db.query(models.Message).filter(models.Message.reciever_id == reciever_id).all()

def get_message_conversation(db: Session, sender_id: int, reciever_id: int):
    return db.query(models.Message).filter(models.Message.sender_id == sender_id, models.Message.reciever_id == reciever_id)\
        .order_by(models.Message.created_at).all()

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(content= message.content, sender_id=message.sender_id, reciever_id=message.reciever_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
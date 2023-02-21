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

def create_role(db: Session, role: schemas.RoleCreate):
    db_role = models.Role(name=role.name)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

# PLANT
def get_plant(db: Session, plant_id: int):
    return db.query(models.Plant).filter(models.Plant.id == plant_id).first()

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

def get_plant_last_photo(db: Session, plant_id: int):
    return db.query(models.Care_Session.photo).join(models.Guard, models.Care_Session.guard_id == models.Guard.id)\
        .filter(models.Guard.plant_id == plant_id).order_by(models.Care_Session.created_at.desc()).first()
        
def get_plant_by_owner(db: Session, user_id: int):
    return db.query(models.Plant).filter(models.Plant.user_id == user_id).all()

# def get_free_plant_by_owner(db: Session, user_id: int, guard_ids: list[int]):
#     return db.query(models.Plant).join(models.Guard, models.Guard.plant_id == models.Plant.id)\
#         .filter(models.Plant.user_id == user_id, models.Guard.id.not_in(guard_ids)).all()

def get_plant_by_guardian(db: Session, user_id: int):
    return db.query(models.Plant).join(models.Guard, models.Plant.id == models.Guard.plant_id)\
        .filter(models.Guard.user_id == user_id).all()
    
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
    db_guard = models.Guard(plant_id = guard.plant_id, start_at = guard.start_at, end_at = guard.end_at)
    db.add(db_guard)
    db.commit()
    db.refresh(db_guard)
    return db_guard

def accept_guard(db: Session, user_id: int):
    db_guard = get_guard(db, user_id)

    if db_guard:
        db_guard.user_id = user_id
        db.commit()
        db.refresh(db_guard)

    return db_guard

# def get_guard_id_by_user(db: Session, user_id: int):
#     return db.query(models.Guard.id).join(models.Plant, models.Guard.plant_id == models.Plant.id)\
#         .filter(models.Plant.user_id == user_id, models.Guard.start_at <= now , models.Guard.end_at >= now ).all()


#CARE SESSION 
def get_care_session(db: Session, care_session_id: int):
   return db.query(models.Care_Session).filter(models.Care_Session.id == care_session_id).first()

def get_care_session_guard_id(db : Session, guard_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Care_Session).offset(skip).limit(limit).filter(models.Care_Session.guard_id == guard_id).order_by(models.Care_Session.created_at.desc()).all()

def get_care_sessions(db: Session, skip: int = 0, limit: int = 100):
   return db.query(models.Care_Session).offset(skip).limit(limit).order_by(models.Care_Session.created_at.desc()).all()

def create_care_session(db: Session, care_session: schemas.CareSessionCreate):
    db_care_session = models.CareSession(guard_id = care_session.guard_id, photo = care_session.photo)
    db.add(db_care_session)
    db.commit()
    db.refresh(db_care_session)
    return db_care_session

def get_session_by_plant(db: Session, plant_id: int, skip: int = 0, limit: int = 5):
    return db.query(models.Care_Session).join(models.Guard, models.Guard.id == models.Care_Session.guard_id)\
        .join(models.Plant, models.Guard.plant_id == models.Plant.id)\
            .filter(models.Plant.id == plant_id)\
                .order_by(models.Care_Session.created_at)\
                    .offset(skip).limit(limit)\
                    .all()
        

# MESSAGE
def get_message(db: Session, message_id: int):
    return db.query(models.Message).filter(models.Message.id == message_id).first()

def get_message_by_sender(db: Session, sender_id: int):
    return db.query(models.Message).filter(models.Message.sender_id == sender_id).all()

def get_message_by_reciever(db: Session, reciever_id: int):
    return db.query(models.Message).filter(models.Message.reciever_id == reciever_id).all()

def get_message_conversation(db: Session, sender_id: int, reciever_id: int):
    return db.query(models.Message).filter((models.Message.sender_id == sender_id, models.Message.reciever_id == reciever_id)\
                                        | (models.Message.sender_id == reciever_id, models.Message.reciever_id == sender_id))\
        .order_by(models.Message.created_at.desc()).all()

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(content= message.content, sender_id=message.sender_id, reciever_id=message.reciever_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
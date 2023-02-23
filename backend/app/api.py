from fastapi import APIRouter, Depends, HTTPException, status, Header
from . import security, schemas, controllers
from app.database import get_db
from app.security import JWTBearer
from datetime import datetime
from geopy.distance import distance

from sqlalchemy.orm import Session


router = APIRouter()


@router.get("/", tags=["Default"])
async def api_root():
    return {"message": "Welcome on API root url"}


# REGISTER ENDPOINT

@router.post("/signup", tags=["Register"], response_model=schemas.Token)
async def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_email = controllers.get_user_by_email(db, user_email=user.email)
    db_user_login = controllers.get_user_by_login(db, user_login=user.login)

    if db_user_email or db_user_login:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or Login already registered"
        )
    db_user = controllers.create_user(db, user=user)

    if db_user:
        return security.signJWT(user_login=user.login)
    else:
        return {}


# LOGIN ENDPOINT

@router.post("/login", response_model=schemas.Token, tags=["Login"])
async def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = controllers.get_user_by_login(db, user_login=user.login)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )
    if security.verify_password(user.password, db_user.password):
        return security.signJWT(user_login=user.login)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )

# USER ENDPOINTS

@router.get("/users/me", tags=["Users"], response_model=schemas.User, dependencies=[Depends(JWTBearer)])
async def get_current_user(db: Session = Depends(get_db), Authorization: str = Header(None)):
    user = controllers.get_current_user(db, Authorization=Authorization)
    return user

@router.get("/users/{user_id}", tags=["Users"], response_model=schemas.User, dependencies=[Depends(JWTBearer())])
async def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = controllers.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return db_user

@router.put("/users/me", tags=["Users"], response_model=schemas.User, dependencies=[Depends(JWTBearer())])
async def update_user(user: schemas.UserUpdate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_user = controllers.update_user(user=user, user_id=user.id)
    return db_user

@router.get("/users", tags=["ADMIN ROLE"], response_model=list[schemas.User], dependencies=[Depends(JWTBearer())])
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_users = controllers.get_users(db, skip=skip, limit=limit)
    return db_users


# PLANT ENDPOINTS

@router.get("/plants/{plant_id}", tags=["Plants"], response_model=schemas.Plant, dependencies=[Depends(JWTBearer())])
async def read_plant(plant_id: int, db: Session = Depends(get_db)):
    db_plant = controllers.get_plant(db, plant_id=plant_id)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plant not found"
        )
    return db_plant

@router.get("/plants/search/{plant_name}", tags=["Plants"], response_model=list[schemas.Plant], dependencies=[Depends(JWTBearer())])
async def search_plant(plant_name: str, db: Session = Depends(get_db)):
    db_plants = controllers.get_plants_by_name(db, plant_name=plant_name)
    if db_plants is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No plants found"
        )
    return db_plants

@router.get("/plants", tags=["ADMIN ROLE"], response_model=list[schemas.Plant], dependencies=[Depends(JWTBearer())])
async def read_plants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_plants = controllers.get_plants(db, skip=skip, limit=limit)
    return db_plants
        
@router.post("/plants", tags=["Plants"], response_model=schemas.Plant, dependencies=[Depends(JWTBearer())])
async def create_plant(plant: schemas.PlantCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_plant = controllers.create_plant(db, plant=plant, user_id=user.id)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Plant not created"
        )
    return db_plant

@router.delete("/plants/{plant_id}", tags=["Plants"], response_model=schemas.Plant, dependencies=[Depends(JWTBearer())])
async def delete_plant(plant_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_plant = controllers.get_plant(db, plant_id=plant_id)
    user = controllers.get_current_user(db, Authorization=Authorization)

    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plant not found"
        )
    if db_plant not in user.plants:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Unauthorized"
        )
    for guard in db_plant.guards:
        if guard.user_id and guard.start_at < datetime.now() and datetime.now() < guard.end_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="You can't delete a plant with an active guard"
            )

    db_plant = controllers.delete_plant(db, plant_id=plant_id)
    return db_plant
    

# GUARD ENDPOINTS

@router.post("/guards", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def create_guard(guard: schemas.GuardCreate, plant_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_plant = controllers.get_plant(db, plant_id)
    user = controllers.get_current_user(db, Authorization=Authorization)

    if db_plant not in user.plants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="You can only create guard for your plants"
            )

    db_guard = controllers.create_guard(db, guard=guard, plant_id=plant_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Guard not created"
        )
    return db_guard

@router.put("/guards/{guard_id}/take", tags=["BOTANIST ROLE"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def take_guard(guard_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    db_guard = controllers.get_guard(db, guard_id)
    user = controllers.get_current_user(db, Authorization=Authorization)

    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guard not found"
        )
    if db_guard.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Guard already taken"
        )

    for plant in user.plants:
        if db_guard in plant.guards:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="You can't take a guard you have created"
            )

    db_guard = controllers.take_guard(db, guard_id=guard_id, user_id=user.id)
    return db_guard

@router.get("/guards", tags=["ADMIN ROLE"], response_model=list[schemas.Guard], dependencies=[Depends(JWTBearer())])
async def read_guards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_guards = controllers.get_guards(db, skip=skip, limit=limit)
    return db_guards

@router.get("/guards/open", tags=["BOTANIST ROLE"], response_model=list[schemas.Guard], dependencies=[Depends(JWTBearer())])
async def read_open_guards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    db_guards = controllers.get_open_guards(db, skip=skip, limit=limit)
    return db_guards

@router.get("/guards/open/around", tags=["BOTANIST ROLE"], response_model=list[schemas.Guard], dependencies=[Depends(JWTBearer())])
async def read_open_guards_aroud_me(location: schemas.Location, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_guards = controllers.get_open_guards(db, skip=skip, limit=limit)
    guards_around = []
    for guard in db_guards:
        plant_pos = (guard.plant.pos_lat, guard.plant.pos_lng)
        plant_distance = distance((location.pos_loat, location.pos_lng), plant_pos).km
        if plant_distance <= location.radius and guard not in user:
            for plant in user.plants:
                if guard not in plant.guards:
                    guards_around.append(guard)
    return guards_around

@router.get("/guards/{guard_id}", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def read_guard(guard_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_guard = controllers.get_guard(db, guard_id=guard_id)
    user = controllers.get_current_user(db, Authorization=Authorization)

    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guard not found"
        )

    if db_guard not in user.guards and db_guard.plant not in user.plants and not db_guard.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Unauthorized"
        )

    return db_guard

@router.put("/guards/{guard_id}/cancel", tags=["BOTANIST ROLE"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def cancel_guard(guard_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_guard = controllers.get_guard(db, guard_id=guard_id)
    
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guard not found"
        )

    if db_guard not in user.guards or not db_guard.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Unauthorized"
        )
        
    db_guard = controllers.cancel_guard(db, guard_id=guard_id)
    return db_guard

@router.delete("/guards/{guard_id}", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def delete_guard(guard_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_guard = controllers.get_guard(db, guard_id=guard_id)
    user = controllers.get_current_user(db, Authorization=Authorization)
    
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guard not found"
        )

    if db_guard.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Guard is already taken, you can't delete it"
        )

    for plant in user.plants:
        if db_guard in plant.guards:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="You didn't created that guard"
            )
        
    db_guard = controllers.delete_guard(db, guard_id=guard_id)
    return db_guard


# SESSION ENDPOINTS

@router.get("/sessions", tags=["ADMIN ROLE"], response_model=list[schemas.CareSession], dependencies=[Depends(JWTBearer())])
async def read_sessions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_sessions = controllers.get_cares_sessions(db, skip=skip, limit=limit)
    return db_sessions

@router.get("/sessions/{session_id}", tags=["Sessions"], response_model=schemas.CareSession, dependencies=[Depends(JWTBearer())])
async def read_session(session_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_session = controllers.get_care_session(db, session_id=session_id)

    for plant in user.plants:
        for guard in plant.guards:
            if db_session not in guard.care_sessions:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, 
                    detail="You don't have access to this ressource"
                )
                    
    for guard in user.guards:
        if db_session not in guard.care_sessions:
            raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED, 
                        detail="You don't have access to this ressource"
                    )
    
    return db_session

@router.post("/sessions", tags=["BOTANIST ROLE"], response_model=schemas.CareSession, dependencies=[Depends(JWTBearer())])
async def create_session(session: schemas.CareSessionCreate, guard_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    user = controllers.get_current_user(db, Authorization=Authorization)
    
    for guard in user.guards:
        if guard_id in guard:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="You can't create a session for a guard you didn't take"
            )
               
    db_session = controllers.create_care_session(db, care_session=session, guard_id=guard_id)
    
    if db_session is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session not created"
        )

    return db_session


# MESSAGE ENDPOINTS

@router.post("/messages/{reciever_id}", tags=["Messages"], response_model=schemas.Message, dependencies=[Depends(JWTBearer())])
async def create_message(reciever_id: int, message: schemas.MessageCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    sender = controllers.get_current_user(db, Authorization=Authorization)
    reciever = controllers.get_user(db, reciever_id)
    
    if sender is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sender doesn't exist"
        )
        
    if reciever is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="reciever doesn't exist"
        )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your message is empty"
        )
    
    db_message = controllers.create_message(db, message=message, sender_id=sender.id, reciever_id=reciever.id)
    
    if db_message is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message not created"
        )
        
    return db_message

@router.get("/messages", tags=["ADMIN ROLE"], response_model=list[schemas.Message], dependencies=[Depends(JWTBearer())])
async def read_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_messages = controllers.get_messages(db, skip=skip, limit=limit)
    return db_messages

@router.get("/messages/{interlocutor_id}", tags=["Messages"], response_model=list[schemas.Message], dependencies=[Depends(JWTBearer())])
async def create_message(interlocutor_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_user = controllers.get_current_user(db, Authorization=Authorization)
    db_interlocutor = controllers.get_user(db, interlocutor_id)
    
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current user doesn't exist"
        )
        
    if db_interlocutor is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interlocutor doesn't exist"
        )
        
    db_messages = controllers.get_messages_conversation(db, user_id=db_user.id, interlocutor_id=db_interlocutor.id)
    
    if db_messages is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Messages not found"
        )
        
    return db_messages
    
    
# ADVICE ENDPOINTS

@router.get("/advices", tags=["Advices"], response_model=list[schemas.Advice], dependencies=[Depends(JWTBearer())])
async def read_advices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_advices = controllers.get_advices(db, skip=skip, limit=limit)
    return db_advices
    
@router.get("/advices/{advice_id}", tags=["Advices"], response_model=schemas.Advice, dependencies=[Depends(JWTBearer())])
async def read_advice(advice_id: int, db: Session = Depends(get_db)):
    db_advice = controllers.get_advice(db, advice_id=advice_id)
    if db_advice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advice not found"
        )
    return db_advice

@router.get("/advices/search/{advices_title}", tags=["Advices"], response_model=list[schemas.Advice], dependencies=[Depends(JWTBearer())])
async def search_advice(advices_title: str, db: Session = Depends(get_db)):
    db_advices = controllers.get_advices_by_title(db, advices_title=advices_title)
    if db_advices is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No Advices found"
        )
    return db_advices

@router.post("/advices", tags=["BOTANIST ROLE"], response_model=schemas.Advice, dependencies=[Depends(JWTBearer())])
async def create_advice(advice: schemas.AdviceCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_advice = controllers.create_advice(db, advice=advice, user_id=user.id)
    if db_advice is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Advice not created"
        )
    return db_advice

@router.put("/advices/{advice_id}", tags=["BOTANIST ROLE"], response_model=schemas.Advice, dependencies=[Depends(JWTBearer())])
async def update_advice(advice_id: int, advice: schemas.AdviceUpdate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_advice = controllers.get_advice(db, advice_id=advice_id)
    if db_advice not in user.advices:
        raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="You can't update an advice you didn't create"
            )
    db_advice = controllers.update_advice(db, advice=advice, advice_id=advice_id)
    if db_advice is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Advice not updated"
        )
    return db_advice

@router.delete("/advices/{advice_id}", tags=["BOTANIST ROLE"], response_model=schemas.Advice, dependencies=[Depends(JWTBearer())])
async def delete_advice(advice_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    user = controllers.get_current_user(db, Authorization=Authorization)
    db_advice = controllers.get_advice(db, advice_id=advice_id)
    if db_advice not in user.advices:
        raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="You can't delete an advice you didn't create"
            )
    db_advice = controllers.delete_advice(db, advice_id=advice_id)
    return db_advicel
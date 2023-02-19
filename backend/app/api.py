from fastapi import APIRouter, Depends, HTTPException, status, Header
from . import security, schemas, controllers
from app.database import get_db
from app.security import JWTBearer

from sqlalchemy.orm import Session


ACCESS_TOKEN_EXPIRE_MINUTES = 120

router = APIRouter()

# TODO : Identification à tout les end point necessaires

@router.get("/")
async def api_root():
    return {"message": "Welcome on API root url"}

@router.post("/signup")
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
        return security.signJWT(user.login)
    else:
        return {}

@router.post("/login")
async def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = controllers.get_user_by_login(db, user_login=user.login)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )
    if security.verify_password(user.password, db_user.password):
        return security.signJWT(user.login)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
        )

@router.get("/users/me", response_model=schemas.User, dependencies=[Depends(JWTBearer)])
async def get_current_user(db: Session = Depends(get_db), Authorization: str = Header(None)):

    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
    db_user = controllers.get_user_by_login(db, user_login=decoded_token['user_login'])
    return db_user

@router.get("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(JWTBearer())])
async def read_user(user_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_user = controllers.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return db_user

@router.post("/users", dependencies=[Depends(JWTBearer())])
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_user =  controllers.create_user(db, user)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User not created",
        )
    return db_user
        
@router.get("/plants/details/{plant_id}", dependencies=[Depends(JWTBearer())])
async def read_plant_details(plant_id= int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_plant = controllers.get_plant(db, plant_id=plant_id)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plant not found"
        )
    db_user = controllers.get_user(db, user_id=db_plant.user_id)
    db_photo = controllers.get_plant_last_photo(db, plant_id=plant_id)
    return {"plant": db_plant, "user": db_user, "last_photo": db_photo}

@router.post("/plants", dependencies=[Depends(JWTBearer())])
async def create_plant(plant: schemas.PlantCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_plant =  controllers.create_plant(db, plant)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Plant not created",
        )
    return db_plant

@router.get("/plants/owner/{user_id}", dependencies=[Depends(JWTBearer())])
async def read_plant_by_owner(user_id= int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
    
    db_plants = controllers.get_plant_by_owner(db, user_id=user_id)
    if db_plants is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No plant found for this user",
        )
    
    return db_plants


@router.get("/plants/guardian/{user_id}", dependencies=[Depends(JWTBearer())])
async def read_plant_by_guardian(user_id= int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
    
    db_plants = controllers.get_plant_by_guardian(db, user_id=user_id)
    if db_plants is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No plant found for this user",
        )
    
    return db_plants

@router.post("/guards", dependencies=[Depends(JWTBearer())])
async def create_guard(guard: schemas.GuardCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_guard =  controllers.create_guard(db, guard)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Guard not created",
        )
    return db_guard
    
@router.put("/guards/{user_id}", dependencies=[Depends(JWTBearer())])
async def accpet_guard(user_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
    
    db_guard = controllers.accept_guard(db, user_id= user_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guard not found",
        )
    return db_guard


@router.post("/messages", dependencies=[Depends(JWTBearer())])
async def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_message = controllers.create_message(db, message= message)
    if db_message is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Guard not created",
        )
    return db_message


@router.get("/messages/{sender_id}", dependencies=[Depends(JWTBearer())])
async def read_conversation(sender_id: int, reciever_id: int,db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_messages = controllers.get_message_conversation(db, sender_id=sender_id, reciever_id=reciever_id )
    if db_messages is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No messages found for this conversation",
        )
    
    return db_messages


@router.get("/guards/{user_id}", dependencies=[Depends(JWTBearer())])
async def read_user_guards(user_id: int,db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_guards = controllers.get_guard_by_user_id(db, user_id=user_id)
    if db_guards is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No guards found for this user",
        )
    
    return db_guards

@router.post("/sessions", dependencies=[Depends(JWTBearer())])
async def create_session(session: schemas.CareSessionCreate, db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_session = controllers.create_care_session(db, care_session=session)
    if db_session is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Care session not created",
        )
    return db_session

@router.get("/sessions/{user_id}", dependencies=[Depends(JWTBearer())])
async def read_sessions(user_id: int,db: Session = Depends(get_db), Authorization: str = Header(None)):
    
    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_sessions = controllers.get_care_session_guard_id(db, guard_id=user_id)
    if db_sessions is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No care sessions found for this user",
        )
    
    return db_sessions
    

@router.get("/plants/{plant_id}", response_model=schemas.Plant)
async def read_plant(plant_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):

    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
        
    db_plant = controllers.get_plant(db, plant_id=plant_id)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found",
        )
    return db_plant
from fastapi import APIRouter, Depends, HTTPException, status, Header
from . import security, schemas, controllers
from app.database import get_db
from app.security import JWTBearer

from sqlalchemy.orm import Session


ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()


@router.get("/", tags=["Default"])
async def api_root():
    return {"message": "Welcome on API root url"}


# REGISTER ENDPOINT
@router.post("/signup", tags=["Register"])
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
@router.post("/login", tags=["Login"])
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

    token = Authorization.split(" ")[1]
    decoded_token = security.decodeJWT(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired"
        )
    db_user = controllers.get_user_by_login(db, user_login=decoded_token['user_login'])
    return db_user

@router.get("/users/{user_id}", tags=["Users"], response_model=schemas.User, dependencies=[Depends(JWTBearer())])
async def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = controllers.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return db_user

@router.get("/users", tags=["Users"], response_model=list[schemas.User], dependencies=[Depends(JWTBearer())])
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

@router.get("/plants", tags=["Plants"], response_model=list[schemas.Plant], dependencies=[Depends(JWTBearer())])
async def read_plants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_plants = controllers.get_plants(db, skip=skip, limit=limit)
    return db_plants
        
@router.post("/plants", tags=["Plants"], response_model=schemas.Plant, dependencies=[Depends(JWTBearer())])
async def create_plant(plant: schemas.PlantCreate, user_id: int, db: Session = Depends(get_db)):
    db_plant = controllers.create_plant(db, plant=plant, user_id=user_id)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Plant not created"
        )
    return db_plant

@router.delete("/plants/{plant_id}", tags=["Plants"], response_model=schemas.Plant, dependencies=[Depends(JWTBearer())])
async def delete_plant(plant_id: int, db: Session = Depends(get_db)):
    db_plant = controllers.get_plant(db, plant_id=plant_id)
    if db_plant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Plant not found"
        )
    db_plant = controllers.delete_plant(db, plant_id=plant_id)
    return db_plant
    

# GUARD ENDPOINTS

@router.post("/guards", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def create_guard(guard: schemas.GuardCreate, plant_id: int, db: Session = Depends(get_db)):
    db_guard = controllers.create_guard(db, guard=guard, plant_id=plant_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Guard not created"
        )
    return db_guard

@router.put("/guards/{guard_id}", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def accept_guard(guard_id: int, user_id: int, db: Session = Depends(get_db)):
    db_guard = controllers.get_guard(db, guard_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guard not found"
        )
    db_guard = controllers.take_guard(db, guard_id=guard_id, user_id=user_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Guard not updated"
        )
    return db_guard

@router.get("/guards/user/{user_id}", tags=["Guards"], response_model=list[schemas.Guard], dependencies=[Depends(JWTBearer())])
async def read_plant(user_id: int, db: Session = Depends(get_db)):
    db_guards = controllers.get_guards_by_user(db, user_id=user_id)
    if db_guards is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guards not found"
        )
    return db_guards

@router.get("/guards/{guard_id}", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def read_plant(guard_id: int, db: Session = Depends(get_db)):
    db_guard = controllers.get_guard(db, guard_id=guard_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Guard not found"
        )
    return db_guard



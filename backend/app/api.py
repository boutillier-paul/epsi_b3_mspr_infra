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
    db_user = controllers.get_current_user(db, Authorization=Authorization)
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

@router.get("/users", tags=["Users", "ADMIN ROLE"], response_model=list[schemas.User], dependencies=[Depends(JWTBearer())])
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

@router.get("/plants", tags=["Plants", "ADMIN ROLE"], response_model=list[schemas.Plant], dependencies=[Depends(JWTBearer())])
async def read_plants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_plants = controllers.get_plants(db, skip=skip, limit=limit)
    return db_plants
        
@router.post("/plants", tags=["Plants"], response_model=schemas.Plant, dependencies=[Depends(JWTBearer())])
async def create_plant(plant: schemas.PlantCreate, user_id: int, db: Session = Depends(get_db)):
    db_plant = controllers.create_plant(db, plant=plant, user_id=user_id)
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

    db_plant = controllers.delete_plant(db, plant_id=plant_id)
    return db_plant
    

# GUARD ENDPOINTS

@router.post("/guards", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def create_guard(guard: schemas.GuardCreate, plant_id: int, db: Session = Depends(get_db)):
    db_guard = controllers.create_guard(db, guard=guard, plant_id=plant_id)
    if db_guard is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Guard not created"
        )
    return db_guard

@router.put("/guards/{guard_id}", tags=["Guards", "BOTANIST ROLE"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
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

@router.get("/guards", tags=["Guards", "ADMIN ROLE"], response_model=list[schemas.Guard], dependencies=[Depends(JWTBearer())])
async def read_guards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="ADMIN", Authorization=Authorization)
    db_guards = controllers.get_guards(db, skip=skip, limit=limit)
    return db_guards

@router.get("/guards/open", tags=["Guards", "BOTANIST ROLE"], response_model=list[schemas.Guard], dependencies=[Depends(JWTBearer())])
async def read_open_guards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), Authorization: str = Header(None)):
    controllers.check_user_role(db, role_name="BOTANIST", Authorization=Authorization)
    db_guards = controllers.get_open_guards(db, skip=skip, limit=limit)
    return db_guards

@router.get("/guards/{guard_id}", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def read_guard(guard_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_guard = controllers.get_guard(db, guard_id=guard_id)
    user = controllers.get_current_user(db, Authorization=Authorization)

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

    return db_guard

@router.put("/guards/{guard_id}", tags=["Guards"], response_model=schemas.Guard, dependencies=[Depends(JWTBearer())])
async def cancel_guard(guard_id: int, user_id: int, db: Session = Depends(get_db), Authorization: str = Header(None)):
    db_guard = controllers.cancel_guard(db, guard_id)
    user = controllers.get_current_user(db, Authorization=Authorization)
    
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
        
    db_guard = controllers.take_guard(db, guard_id=guard_id, user_id=user_id)
    return db_guard


# SESSION ENDPOINTS

@router.post("/sessions", tags=["Sessions"], response_model=schemas.CareSession, dependencies=[Depends(JWTBearer())])
async def create_session(session: schemas.CareSessionCreate, guard_id: int, db: Session = Depends(get_db)):
    db_session = controllers.create_care_session(db, care_session=session, guard_id=guard_id)
    if db_session is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session not created"
        )
    return db_session

from fastapi import APIRouter, Depends, HTTPException, status, Header
from . import security, schemas, controllers
from app.database import get_db
from app.security import JWTBearer

from sqlalchemy.orm import Session


ACCESS_TOKEN_EXPIRE_MINUTES = 120

router = APIRouter()


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
async def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = controllers.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return db_user

# @router.get("/plant/{plant_id}", response_model=schemas.Plant)
# async def read_plant(plant_id: int, db: Session = Depends(get_db)):
#     db_plant = controllers.get_plant(db, plant_id=plant_id)
#     if db_plant is None:
#         raise HTTPException(status_code=404, detail="Plant not found")
#     return db_plant
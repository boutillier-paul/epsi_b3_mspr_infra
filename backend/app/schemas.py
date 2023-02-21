from pydantic import BaseModel
from datetime import datetime

# Care Session
class CareSessionBase(BaseModel):
    photo: str
    report: str | None = None

class CareSession(CareSessionBase):
    id: int
    created_at: datetime
    guard_id: int
    
    class Config:
        orm_mode = True

class CareSessionCreate(CareSessionBase):
    pass

class CareSessionUpdate(CareSessionBase):
    pass


# Guard
class GuardBase(BaseModel):
    start_at: datetime
    end_at: datetime

class Guard(GuardBase):
    id: int
    plant_id: int
    user_id: int | None = None
    created_at: datetime
    sessions: list[CareSession] = []

    class Config:
        orm_mode = True

class GuardCreate(GuardBase):
    pass

class GuardUpdate(GuardBase):
    user_id: int 
   
     
# Plant
class PlantBase(BaseModel):
    name: str
    species: str
    photo: str
    pos_lat: float
    pos_lng: float

class Plant(PlantBase):
    id: int
    user_id: int
    guards: list[Guard] = []
    created_at: datetime

    class Config:
        orm_mode = True

class PlantCreate(PlantBase):
    pass

class PlantUpdate(PlantBase):
    pass

# Advice
class AdviceBase(BaseModel):
    title: str
    content: str
    photo: str

class Advice(AdviceBase):
    id: int
    created_at: datetime
    user_id: int
    
    class Config:
        orm_mode = True

class AdviceCreate(AdviceBase):
    pass

class AdviceUpdate(AdviceBase):
    pass

# User
class UserBase(BaseModel):
    last_name: str
    first_name: str
    email: str

class User(UserBase):
    id: int
    role_id: int 
    plants: list[Plant] = []
    guards: list[Guard] = []
    advices: list[Advice] = []
    created_at: datetime

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    login: str
    password: str

class UserUpdate(UserBase):
    pass

class UserLogin(BaseModel):
    login: str
    password: str

# Role
class RoleBase(BaseModel):
    name: str

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True

# Message
class MessageBase(BaseModel):
    content: str

class Message(MessageBase):
    id: int
    created_at: datetime
    sender_id: int
    reciever_id: int
    
    class Config:
        orm_mode = True

class MessageCreate(MessageBase):
    pass

class MessageUpdate(MessageBase):
    pass
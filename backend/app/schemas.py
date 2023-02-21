from pydantic import BaseModel
from datetime import datetime

# Plant
class PlantBase(BaseModel):
    name: str
    species: str
    photo: str

class PlantCreate(PlantBase):
    pass

class Plant(PlantBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

class PlantUpdate(PlantBase):
    pass

# User
class UserBase(BaseModel):
    last_name: str
    first_name: str
    email: str
    city: str
    num_adress: int
    street: str
    code: int
    phone: str

class UserCreate(UserBase):
    login: str
    password: str

class UserLogin(BaseModel):
    login: str
    password: str

class User(UserBase):
    id: int
    role_id: int | None = None
    # plants: list[Plant]

    class Config:
        orm_mode = True

class UserUpdate(UserBase):
    pass

# Role
class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True

# Guard
class GuardBase(BaseModel):
    end_at: datetime | None = None

class GuardCreate(GuardBase):
    pass

class GuardUpdate(GuardBase):
    end_at: datetime

class Guard(GuardBase):
    id: int
    start_at: datetime
    user_id: int
    plant_id: int

    class Config:
        orm_mode = True


# Care Session
class CareSessionBase(BaseModel):
    photo: str
    report: str | None = None

class CareSessionCreate(CareSessionBase):
    pass

class CareSession(CareSessionBase):
    id: int
    created_at: datetime
    guard_id: int
    
    class Config:
        orm_mode = True


# Message
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    created_at: datetime
    sender_id: int
    reciever_id: int
    
    class Config:
        orm_mode = True
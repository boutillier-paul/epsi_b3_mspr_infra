"""
    SCHEMAS
"""
from datetime import datetime
from pydantic import BaseModel
from fastapi import UploadFile

# Location
class Location(BaseModel):
    """
        Location
    """
    pos_lat: float
    pos_lng: float
    radius: int

# Token
class Token(BaseModel):
    """
        Token
    """
    access_token: str

# Care Session
class CareSessionBase(BaseModel):
    """
        CareSessionBase
    """
    photo: str
    report: str | None = None

class CareSession(CareSessionBase):
    """
        CareSession
    """
    id: int
    created_at: datetime
    guard_id: int
    class Config:
        """
            Config
        """
        orm_mode = True

class CareSessionCreate(CareSessionBase):
    """
        CareSessionCreate
    """

class CareSessionUpdate(CareSessionBase):
    """
        CareSessionUpdate
    """


# Guard
class GuardBase(BaseModel):
    """
        GuardBase
    """
    start_at: datetime
    end_at: datetime

class Guard(GuardBase):
    """
        Guard
    """
    id: int
    plant_id: int
    user_id: int | None = None
    created_at: datetime
    sessions: list[CareSession] = []

    class Config:
        """
            Config
        """
        orm_mode = True

class GuardCreate(GuardBase):
    """
        GuardCreate
    """

class GuardUpdate(GuardBase):
    """
        GuardUpdate
    """
    user_id: int

# Plant
class PlantBase(BaseModel):
    """
        PlantBase
    """
    name: str
    species: str
    photo: UploadFile | str
    pos_lat: float
    pos_lng: float

class Plant(PlantBase):
    """
        Plant
    """
    id: int
    user_id: int
    guards: list[Guard] = []
    created_at: datetime

    class Config:
        """
            Config
        """
        orm_mode = True

class PlantCreate(PlantBase):
    """
        PlantCreate
    """

class PlantUpdate(PlantBase):
    """
        PlantUpdate
    """

# Advice
class AdviceBase(BaseModel):
    """
        AdviceBase
    """
    title: str
    content: str
    photo: str

class Advice(AdviceBase):
    """
        Advice
    """
    id: int
    created_at: datetime
    user_id: int
    class Config:
        """
            Config
        """
        orm_mode = True

class AdviceCreate(AdviceBase):
    """
        AdviceCreate
    """

class AdviceUpdate(BaseModel):
    """
        AdviceUpdate
    """
    title: str
    content: str

# User
class UserBase(BaseModel):
    """
        UserBase
    """
    last_name: str
    first_name: str
    email: str

class User(UserBase):
    """
        User
    """
    id: int
    role_id: int
    plants: list[Plant] = []
    guards: list[Guard] = []
    advices: list[Advice] = []
    created_at: datetime

    class Config:
        """
            Config
        """
        orm_mode = True

class UserCreate(UserBase):
    """
        UserCreate
    """
    login: str
    password: str

class UserUpdate(UserBase):
    """
        UserUpdate
    """

class UserLogin(BaseModel):
    """
        UserLogin
    """
    login: str
    password: str

# Botanist
class Botanist(UserBase):
    """
        Botanist
    """
    id: int

# Role
class RoleBase(BaseModel):
    """
        RoleBase
    """
    name: str

class Role(RoleBase):
    """
        Role
    """
    id: int

    class Config:
        """
            Config
        """
        orm_mode = True

# Message
class MessageBase(BaseModel):
    """
        MessageBase
    """
    content: str

class Message(MessageBase):
    """
        Message
    """
    id: int
    created_at: datetime
    sender_id: int
    reciever_id: int
    class Config:
        """
            Config
        """
        orm_mode = True

class MessageCreate(MessageBase):
    """
        MessageCreate
    """

class MessageUpdate(MessageBase):
    """
        MessageUpdate
    """

from pydantic import BaseModel

# User
class UserBase(BaseModel):
    last_name: str
    first_name: str
    email: str
    city: str
    num_adress: int
    street: str
    code: int
    phone: int

class User(UserBase):
    id: int
    role_id: int

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    login: str
    password: str


# Role
class RoleBase(BaseModel):
    name: str

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True

class RoleCreate(RoleBase):
    pass


# Authorization
class AuthorizationBase(BaseModel):
    name: str

class Authorization(AuthorizationBase):
    id: int

class AuthorizationCreate(AuthorizationBase):
    pass


# Role_Authorization
class Role_AuthorizationBase(BaseModel):
    pass

class Role_Authorization(Role_AuthorizationBase):
    pass



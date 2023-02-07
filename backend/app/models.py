from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique_key=True)
    last_name = Column(String)
    first_name = Column(String)
    email = Column(String, unique_key=True)
    login = Column(String, unique_key=True)
    password = Column(String)
    city = Column(Integer)
    num_adress = Column(Integer)
    street = Column(String)
    code = Column(Integer)
    phone = Column(Integer)

    role_id = Column(Integer, ForeignKey("role.id"))
    role = relationship("Role", back_populates="role")


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique_key=True)
    name = Column(String)

class Authorization(Base):
    __tablename__ = "authorization"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique_key=True)
    name = Column(String)

class Role_Authorization():
    __tablename__ = "role_authorization"

    role_id = Column(Integer, ForeignKey("role.id"))
    role = relationship("Role", back_populates="role")

    authorization_id = Column(Integer, ForeignKey("authorization.id"))
    authorization = relationship("Authorization", back_populates="authorization")

class Plant(Base):
    __tablename__ = "plant"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, unique_key=True)
    name = Column(String)
    spicies = Column(String)
    photo = Column(String, unique_key=True)

    owner = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="user")




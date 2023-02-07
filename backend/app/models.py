from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    login = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    city = Column(String, nullable=False)
    num_adress = Column(Integer, nullable=False)
    street = Column(String, nullable=False)
    code = Column(Integer, nullable=False)
    phone = Column(Integer, nullable=False)

    role_id = Column(Integer, ForeignKey("role.id"))
    role = relationship("Role", back_populates="role")


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)


class Authorization(Base):
    __tablename__ = "authorization"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)


class Role_Authorization():
    __tablename__ = "role_authorization"

    role_id = Column(Integer, ForeignKey("role.id"))
    role = relationship("Role", back_populates="role")

    authorization_id = Column(Integer, ForeignKey("authorization.id"))
    authorization = relationship("Authorization", back_populates="authorization")


class Plant(Base):
    __tablename__ = "plant"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    spicies = Column(String, nullable=False)
    photo = Column(String, unique=True, nullable=True)

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="user")

class Guard(Base):
    __tablename__ = "guard"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)

    user_id = Column(Integer,  ForeignKey("user.id"))
    user = relationship("User", back_populates="user")

    plant_id = Column(Integer,  ForeignKey("plant.id"))
    plant = relationship("Plant", back_populates="plant")

    start_at = Column(DateTime, default=func.now())
    end_at = Column(DateTime, nullable=True)


class Care_Session(Base):
    __tablename__ = "care_session"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)

    guard_id = Column(Integer,  ForeignKey("guard.id"))
    guard = relationship("Guard", back_populates="guard")

    photo = Column(String, unique=True, nullable=False)

    report = Column(Text, nullable=True)


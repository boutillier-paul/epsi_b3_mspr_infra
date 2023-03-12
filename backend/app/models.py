from sqlalchemy import Column, ForeignKey, Integer, Float, String, DateTime, Text, func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    login = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    role_id = Column(Integer, ForeignKey("roles.id"), default=1)
    role = relationship("Role")

    plants = relationship("Plant", back_populates="user")
    guards = relationship("Guard", back_populates="user")
    advices = relationship("Advice", back_populates="user")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)

class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    photo = Column(String, unique=True, nullable=True)
    pos_lat = Column(Float, nullable=False)
    pos_lng = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="plants")

    guards = relationship("Guard", back_populates="plant")

class Guard(Base):
    __tablename__ = "guards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)

    user_id = Column(Integer,  ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="guards")

    plant_id = Column(Integer,  ForeignKey("plants.id"))
    plant = relationship("Plant", back_populates="guards")

    start_at = Column(DateTime, default=func.now())
    end_at = Column(DateTime, nullable=False)

    created_at = Column(DateTime, nullable=False, default=func.now())

    care_sessions = relationship("Care_Session", back_populates="guard")


class Care_Session(Base):
    __tablename__ = "care_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)

    guard_id = Column(Integer,  ForeignKey("guards.id"))
    guard = relationship("Guard", back_populates="care_sessions")

    photo = Column(String, unique=True, nullable=False)
    report = Column(Text, nullable=True)

    created_at = Column(DateTime, default=func.now())


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    content = Column(Text, nullable=False)

    sender_id = Column(Integer,  ForeignKey("users.id"))
    sender = relationship("User", foreign_keys=[sender_id])

    reciever_id = Column(Integer,  ForeignKey("users.id"))
    reciever = relationship("User", foreign_keys=[reciever_id])

    created_at = Column(DateTime, default=func.now())


class Advice(Base):
    __tablename__ = "advices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    photo = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())

    user_id = Column(Integer,  ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="advices")
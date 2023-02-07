from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Text, func
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
    city = Column(String, nullable=False)
    num_adress = Column(Integer, nullable=False)
    street = Column(String, nullable=False)
    code = Column(Integer, nullable=False)
    phone = Column(String, nullable=False)

#     role_id = Column(Integer, ForeignKey("roles.id"))
#     role = relationship("Role", back_populates="roles")

    plants = relationship("Plant", back_populates="user")
    guards = relationship("Guard", back_populates="user")
# 
# 
# class Role(Base):
#     __tablename__ = "roles"
# 
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     name = Column(String, unique=True, nullable=False)
#     users = relationship("User", back_populates="role")
# 
# 
# class Authorization(Base):
#     __tablename__ = "authorizations"
# 
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     name = Column(String, unique=True, nullable=False)
#     roles = relationship("Role", back_populates="role")
# 
# 
# class Role_Authorization():
#     __tablename__ = "role_authorizations"
# 
#     role_id = Column(Integer, ForeignKey("roles.id"))
#     role = relationship("Role", back_populates="roles")
# 
#     authorization_id = Column(Integer, ForeignKey("authorizations.id"))
#     authorization = relationship("Authorization", back_populates="authorizations")


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    spicies = Column(String, nullable=False)
    photo = Column(String, unique=True, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="plants")

    guards = relationship("Guard", back_populates="plant")

class Guard(Base):
    __tablename__ = "guards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)

    user_id = Column(Integer,  ForeignKey("users.id"))
    user = relationship("User", back_populates="guards")

    plant_id = Column(Integer,  ForeignKey("plants.id"))
    plant = relationship("Plant", back_populates="guards")

    start_at = Column(DateTime, default=func.now())
    end_at = Column(DateTime, nullable=True)

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
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic import BaseModel
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./agrovision.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    father_name = Column(String)
    mobile = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    dob = Column(String)
    username = Column(String, unique=True, index=True)
    password = Column(String)

class Scan(Base):
    __tablename__ = "scans"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    filename = Column(String)
    disease = Column(String)
    confidence = Column(Float)
    treatment = Column(String)
    scanned_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    name: str
    father_name: str
    mobile: str
    email: str
    dob: str
    username: str
    password: str

class UserLogin(BaseModel):
    login_id: str
    password: str

class ForgotPassword(BaseModel):
    recovery_id: str

class ResetPassword(BaseModel):
    recovery_id: str
    new_password: str

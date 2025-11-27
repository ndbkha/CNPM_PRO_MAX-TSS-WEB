# app/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from . import db, crud, schemas, utils_jwt

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, database: Session = Depends(db.get_db)):
    hashed = get_password_hash(user_in.password)
    user = crud.create_user(database, user_in.email, user_in.full_name, user_in.faculty or "", user_in.role.value, hashed)
    return user


@router.options("/token")
def token_preflight():
    return {"message": "OK"}

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), database: Session = Depends(db.get_db)):
    user = crud.get_user_by_email(database, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect credentials")
    token = utils_jwt.create_access_token({"sub": str(user.id), "role": user.role.value, "email": user.email})
    return {"access_token": token, "token_type": "bearer"}

# dependency: get current user from token
from fastapi import Security
def get_current_user(token: str = Depends(oauth2_scheme), database: Session = Depends(db.get_db)):
    payload = utils_jwt.verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = int(payload.get("sub"))
    user = crud.get_user(database, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
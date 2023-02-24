"""
    SECURITY
"""

import os
import time
from typing import Dict
import re
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from dotenv import load_dotenv
import jwt


load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("ALGORITHM")

ACCESS_TOKEN_EXPIRE_MINUTES = 60


def is_valid_email(email: str):
    """
        is_valid_email
    """
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w{2,4}$"
    return re.match(pattern, email)

def is_valid_password(password: str):
    """
        is_valid_password
    """
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    return re.match(pattern, password)

def verify_password(plain_password, password):
    """
        verify_password
    """
    return pwd_context.verify(plain_password, password)

def get_password_hash(password):
    """
        get_password_hash
    """
    return pwd_context.hash(password)

def token_response(token: str):
    """
        token_response
    """
    return {"access_token": token}

def sign_jwt(user_login: str) -> Dict[str, str]:
    """
        sign_jwt
    """
    payload = {
        "user_login": user_login,
        "expires": time.time() + 60 * ACCESS_TOKEN_EXPIRE_MINUTES
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)

def decode_jwt(token: str) -> dict:
    """
        decode_jwt
    """
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except ValueError:
        return {}


class JWTBearer(HTTPBearer):
    """
        JWTBearer
    """
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials

        raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        """
            verify_jwt
        """
        is_token_valid: bool = False

        try:
            payload = decode_jwt(jwtoken)
        except ValueError:
            payload = None
        if payload:
            is_token_valid = True
        return is_token_valid

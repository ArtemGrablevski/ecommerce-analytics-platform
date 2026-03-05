from datetime import datetime, timedelta, timezone

import jwt

from src.config import config
from src.dto.auth import JwtTokenPayload
from src.exceptions import InvalidTokenError, TokenExpiredError


class JwtService:
    @staticmethod
    def create_access_token(partner_id: str, name: str) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=config.jwt_expire_minutes)
        payload: JwtTokenPayload = {"sub": partner_id, "name": name, "exp": int(expire.timestamp())}
        return jwt.encode(payload, config.jwt_secret_key, algorithm=config.jwt_algorithm)

    @staticmethod
    def decode_access_token(token: str) -> JwtTokenPayload:
        try:
            payload = jwt.decode(token, config.jwt_secret_key, algorithms=[config.jwt_algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError()
        except jwt.JWTError:
            raise InvalidTokenError()

from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.config import config
from src.database import session_maker
from src.exceptions import InvalidTokenError, TokenExpiredError
from src.models.partner import Partner
from src.repositories.partner_repository import PartnerRepository
from src.services.auth.jwt_service import JwtService
from src.services.partner.partner_service import PartnerService

security = HTTPBearer()


def verify_admin_token(token: str):
    if token != config.admin_bearer_token:
        raise HTTPException(status_code=401, detail="Invalid admin token")


async def verify_partner_secret_key(x_partner_secret: str = Header(alias="X-Partner-Secret")) -> str:
    async with session_maker() as session:
        partner_repository = PartnerRepository(session)
        partner_service = PartnerService(partner_repository)

        partner = await partner_service.get_partner_by_secret_key(x_partner_secret)
        if not partner:
            raise HTTPException(status_code=401, detail="Invalid partner secret key")

        return str(partner.id)


async def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = JwtService.decode_access_token(credentials.credentials)
        partner_id = payload.get("sub")
        if not partner_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        return partner_id
    except TokenExpiredError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_partner(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Partner:
    try:
        payload = JwtService.decode_access_token(credentials.credentials)
        partner_id = payload.get("sub")
        if not partner_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        async with session_maker() as session:
            partner_repository = PartnerRepository(session)
            partner_service = PartnerService(partner_repository)

            partner = await partner_service.get_partner_by_id(partner_id)
            if not partner:
                raise HTTPException(status_code=401, detail="Partner not found")

            return partner
    except TokenExpiredError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

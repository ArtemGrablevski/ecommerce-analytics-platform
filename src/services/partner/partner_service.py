import secrets
from abc import ABC, abstractmethod

import bcrypt

from src.exceptions import InvalidCredentialsError, PartnerAlreadyExistsError
from src.models.partner import Partner
from src.repositories.partner_repository import PartnerRepository
from src.services.auth.jwt_service import JwtService


class PartnerServiceInterface(ABC):
    @abstractmethod
    async def create_partner(self, name: str, password: str) -> str:
        ...

    @abstractmethod
    async def login(self, name: str, password: str) -> str:
        ...

    @abstractmethod
    async def get_partner_by_secret_key(self, secret_key: str) -> Partner | None:
        ...


class PartnerService(PartnerServiceInterface):
    def __init__(self, partner_repository: PartnerRepository):
        self._partner_repository = partner_repository

    async def create_partner(self, name: str, password: str) -> str:
        existing_partner = await self._partner_repository.get_by_name(name)
        if existing_partner:
            raise PartnerAlreadyExistsError(name)

        password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        secret_key = secrets.token_urlsafe(18)

        partner = await self._partner_repository.create_partner(name, password_hash, secret_key)
        return partner.secret_key

    async def login(self, name: str, password: str) -> str:
        partner = await self._partner_repository.get_by_name(name)
        if not partner or not bcrypt.checkpw(password.encode("utf-8"), partner.password_hash.encode("utf-8")):
            raise InvalidCredentialsError()

        token = JwtService.create_access_token(str(partner.id), partner.name)
        return token

    async def get_partner_by_secret_key(self, secret_key: str) -> Partner | None:
        return await self._partner_repository.get_by_secret_key(secret_key)

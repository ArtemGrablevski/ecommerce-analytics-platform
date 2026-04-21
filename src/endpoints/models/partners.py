import uuid
from datetime import datetime

from pydantic import BaseModel


class LoginRequest(BaseModel):
    name: str
    password: str


class PartnerResponse(BaseModel):
    id: uuid.UUID
    name: str
    is_banned: bool
    active_until: datetime | None


class PartnerUpdateRequest(BaseModel):
    is_banned: bool | None = None
    active_until: datetime | None = None


class PartnerProfileResponse(BaseModel):
    id: uuid.UUID
    name: str
    is_banned: bool
    active_until: datetime | None

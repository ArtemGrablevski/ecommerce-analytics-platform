import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.partner import Partner


class PartnerRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_partner(self, name: str, password_hash: str, secret_key: str) -> Partner:
        partner = Partner(name=name, password_hash=password_hash, secret_key=secret_key)
        self.session.add(partner)
        return partner

    async def get_by_name(self, name: str) -> Partner | None:
        stmt = select(Partner).where(Partner.name == name)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_secret_key(self, secret_key: str) -> Partner | None:
        stmt = select(Partner).where(Partner.secret_key == secret_key)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self) -> list[Partner]:
        result = await self.session.scalars(select(Partner))
        return result.all()

    async def get_by_id(self, partner_id: str) -> Partner | None:
        uuid_id = uuid.UUID(partner_id)
        return await self.session.scalar(
            select(Partner).where(Partner.id == uuid_id)
        )

    async def update_partner_admin_fields(self, partner_id: str, is_banned: bool | None = None, active_until: datetime = None) -> bool:
        partner = await self.get_by_id(partner_id)
        if not partner:
            return False

        if is_banned is not None:
            partner.is_banned = is_banned
        if active_until is not None:
            partner.active_until = active_until

        return True

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

from fastapi import APIRouter, Depends, Header, HTTPException

from src.auth.dependencies import get_current_partner, verify_admin_token
from src.database import session_maker
from src.endpoints.models.partners import LoginRequest, PartnerProfileResponse, PartnerResponse, PartnerUpdateRequest
from src.exceptions import InvalidCredentialsError, PartnerAlreadyExistsError
from src.models.partner import Partner
from src.repositories.partner_repository import PartnerRepository
from src.services.partner.partner_service import PartnerService

router = APIRouter(prefix="/partners", tags=["partners"])


@router.post("")
async def create_partner(name: str, password: str, secret: str) -> dict:
    verify_admin_token(secret)

    async with session_maker() as session:
        partner_repository = PartnerRepository(session)
        partner_service = PartnerService(partner_repository)

        try:
            secret_key = await partner_service.create_partner(name, password)
            await session.commit()
            return {"secret_key": secret_key}
        except PartnerAlreadyExistsError as e:
            raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login_partner(request: LoginRequest) -> dict:
    async with session_maker() as session:
        partner_repository = PartnerRepository(session)
        partner_service = PartnerService(partner_repository)

        try:
            token = await partner_service.login(request.name, request.password)
            return {"access_token": token, "token_type": "bearer"}
        except InvalidCredentialsError as e:
            raise HTTPException(status_code=401, detail=str(e))


@router.get("", response_model=list[PartnerResponse])
async def get_all_partners(admin_token: str = Header(alias="X-Admin-Token")) -> list[PartnerResponse]:
    verify_admin_token(admin_token)

    async with session_maker() as session:
        partner_repository = PartnerRepository(session)
        partners = await partner_repository.get_all()

        return [
            PartnerResponse(
                id=partner.id, name=partner.name, is_banned=partner.is_banned, active_until=partner.active_until
            )
            for partner in partners
        ]


@router.patch("/{partner_id}")
async def update_partner(
    partner_id: str, request: PartnerUpdateRequest, admin_token: str = Header(alias="X-Admin-Token")
) -> dict:
    verify_admin_token(admin_token)

    async with session_maker() as session:
        partner_repository = PartnerRepository(session)
        partner_service = PartnerService(partner_repository)

        try:
            await partner_service.update_partner(partner_id, request.is_banned, request.active_until)
            await session.commit()
            return {"message": "Partner updated successfully"}
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Partner not found or update failed: {str(e)}")


@router.get("/me", response_model=PartnerProfileResponse)
async def get_partner_profile(current_partner: Partner = Depends(get_current_partner)) -> PartnerProfileResponse:
    return PartnerProfileResponse(
        id=current_partner.id,
        name=current_partner.name,
        is_banned=current_partner.is_banned,
        active_until=current_partner.active_until,
    )

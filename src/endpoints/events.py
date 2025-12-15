from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends

from src.di import Container
from src.dto.events import (
    ElementClickEventDto,
    FilterAppliedEventDto,
    FormSubmitEventDto,
    ItemAddedToCartEventDto,
    ItemRemovedFromCartEventDto,
    PageViewEventDto,
    SearchEventDto,
    TransactionEventDto,
    UserLoginEventDto,
    UserRegisteredEventDto,
)
from src.endpoints.models.events import (
    ElementClickEvent,
    FilterAppliedEvent,
    FormSubmitEvent,
    ItemAddedToCartEvent,
    ItemRemovedFromCartEvent,
    PageViewEvent,
    SearchEvent,
    TransactionEvent,
    UserLoginEvent,
    UserRegisteredEvent,
)
from src.endpoints.models.responses import SuccessResponse
from src.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/user-registered", response_model=SuccessResponse)
@inject
async def user_registered(
    event: UserRegisteredEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = UserRegisteredEventDto(user_id=event.user_id, timestamp=event.timestamp)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/user-login", response_model=SuccessResponse)
@inject
async def user_login(
    event: UserLoginEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = UserLoginEventDto(user_id=event.user_id, timestamp=event.timestamp)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/transaction", response_model=SuccessResponse)
@inject
async def transaction(
    event: TransactionEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = TransactionEventDto(
        user_id=event.user_id,
        timestamp=event.timestamp,
        transaction_id=event.transaction_id,
        amount=event.amount,
        currency=event.currency,
    )
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/element-click", response_model=SuccessResponse)
@inject
async def element_click(
    event: ElementClickEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = ElementClickEventDto(
        user_id=event.user_id, timestamp=event.timestamp, element_name=event.element_name, page=event.page
    )
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/search", response_model=SuccessResponse)
@inject
async def search(
    event: SearchEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = SearchEventDto(user_id=event.user_id, timestamp=event.timestamp, query=event.query)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/page-view", response_model=SuccessResponse)
@inject
async def page_view(
    event: PageViewEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = PageViewEventDto(user_id=event.user_id, timestamp=event.timestamp, page=event.page)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/form-submit", response_model=SuccessResponse)
@inject
async def form_submit(
    event: FormSubmitEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = FormSubmitEventDto(user_id=event.user_id, timestamp=event.timestamp, form_name=event.form_name)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/item-added-to-cart", response_model=SuccessResponse)
@inject
async def item_added_to_cart(
    event: ItemAddedToCartEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = ItemAddedToCartEventDto(user_id=event.user_id, timestamp=event.timestamp, item_id=event.item_id)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/item-removed-from-cart", response_model=SuccessResponse)
@inject
async def item_removed_from_cart(
    event: ItemRemovedFromCartEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = ItemRemovedFromCartEventDto(user_id=event.user_id, timestamp=event.timestamp, item_id=event.item_id)
    await event_service.process_event(dto)
    return SuccessResponse()


@router.post("/filter-applied", response_model=SuccessResponse)
@inject
async def filter_applied(
    event: FilterAppliedEvent, event_service: EventService = Depends(Provide[Container.event_service])
) -> SuccessResponse:
    dto = FilterAppliedEventDto(
        user_id=event.user_id,
        timestamp=event.timestamp,
        filter_name=event.filter_name,
        filter_value=event.filter_value,
        page=event.page,
    )
    await event_service.process_event(dto)
    return SuccessResponse()

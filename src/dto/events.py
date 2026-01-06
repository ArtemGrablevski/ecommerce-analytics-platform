from abc import ABC
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal


@dataclass
class BaseEvent(ABC):
    user_id: str
    timestamp: datetime


@dataclass
class UserRegisteredEventDto(BaseEvent):
    ...


@dataclass
class UserLoginEventDto(BaseEvent):
    ...


@dataclass
class TransactionEventDto(BaseEvent):
    transaction_id: str
    amount: Decimal
    currency: str


@dataclass
class ElementClickEventDto(BaseEvent):
    element_name: str
    page: str | None = None


@dataclass
class SearchEventDto(BaseEvent):
    query: str


@dataclass
class PageViewEventDto(BaseEvent):
    page: str


@dataclass
class FormSubmitEventDto(BaseEvent):
    form_name: str


@dataclass
class ItemAddedToCartEventDto(BaseEvent):
    item_id: str


@dataclass
class ItemRemovedFromCartEventDto(BaseEvent):
    item_id: str


@dataclass
class FilterAppliedEventDto(BaseEvent):
    filter_name: str
    filter_value: str
    page: str

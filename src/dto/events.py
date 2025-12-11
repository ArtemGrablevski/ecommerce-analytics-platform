from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class UserRegisteredEvent(BaseModel):
    user_id: str
    timestamp: datetime


class UserLoginEvent(BaseModel):
    user_id: str
    timestamp: datetime


class TransactionEvent(BaseModel):
    transaction_id: str
    user_id: str
    amount: Decimal
    currency: str
    timestamp: datetime


class ElementClickEvent(BaseModel):
    user_id: str
    element_name: str
    page: Optional[str] = None
    timestamp: datetime


class SearchEvent(BaseModel):
    user_id: str
    query: str
    timestamp: datetime


class PageViewEvent(BaseModel):
    user_id: str
    page: str
    timestamp: datetime


class FormSubmitEvent(BaseModel):
    user_id: str
    form_name: str
    timestamp: datetime


class ItemAddedToCartEvent(BaseModel):
    user_id: str
    item_id: str
    timestamp: datetime


class ItemRemovedFromCartEvent(BaseModel):
    user_id: str
    item_id: str
    timestamp: datetime


class FilterAppliedEvent(BaseModel):
    user_id: str
    filter_name: str
    filter_value: str
    page: str
    timestamp: datetime

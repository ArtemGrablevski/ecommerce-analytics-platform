from enum import Enum


class KafkaTopic(str, Enum):
    USER_EVENTS = "user_events"
    TRANSACTION_EVENTS = "transaction_events"
    INTERACTION_EVENTS = "interaction_events"


class EventType(str, Enum):
    USER_REGISTERED = "user_registered"
    USER_LOGIN = "user_login"
    TRANSACTION = "transaction"
    ELEMENT_CLICK = "element_click"
    SEARCH = "search"
    PAGE_VIEW = "page_view"
    FORM_SUBMIT = "form_submit"
    ITEM_ADDED_TO_CART = "item_added_to_cart"
    ITEM_REMOVED_FROM_CART = "item_removed_from_cart"
    FILTER_APPLIED = "filter_applied"

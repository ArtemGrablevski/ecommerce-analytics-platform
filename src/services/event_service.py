import dataclasses

from src.dto.dataclass_events import (
    BaseEvent,
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
from src.enums import EventType, KafkaTopic
from src.services.kafka_producer import EventProducerInterface


class EventService:
    def __init__(self, producer: EventProducerInterface):
        self.producer = producer

    async def process_event(self, event: BaseEvent) -> None:
        event_data = dataclasses.asdict(event)

        match event:
            case UserRegisteredEventDto():
                event_data["event_type"] = EventType.USER_REGISTERED
                await self.producer.send_event(KafkaTopic.USER_EVENTS, event_data)
            case UserLoginEventDto():
                event_data["event_type"] = EventType.USER_LOGIN
                await self.producer.send_event(KafkaTopic.USER_EVENTS, event_data)
            case TransactionEventDto():
                event_data["event_type"] = EventType.TRANSACTION
                await self.producer.send_event(KafkaTopic.TRANSACTION_EVENTS, event_data)
            case ElementClickEventDto():
                event_data["event_type"] = EventType.ELEMENT_CLICK
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case SearchEventDto():
                event_data["event_type"] = EventType.SEARCH
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case PageViewEventDto():
                event_data["event_type"] = EventType.PAGE_VIEW
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case FormSubmitEventDto():
                event_data["event_type"] = EventType.FORM_SUBMIT
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case ItemAddedToCartEventDto():
                event_data["event_type"] = EventType.ITEM_ADDED_TO_CART
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case ItemRemovedFromCartEventDto():
                event_data["event_type"] = EventType.ITEM_REMOVED_FROM_CART
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case FilterAppliedEventDto():
                event_data["event_type"] = EventType.FILTER_APPLIED
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case _:
                raise ValueError(f"Unknown event type: {type(event)}")

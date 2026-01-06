from src.dto.events import (
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
        timestamp_str = event.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        event_data = {"user_id": event.user_id, "timestamp": timestamp_str}

        match event:
            case UserRegisteredEventDto():
                event_data["event_type"] = EventType.USER_REGISTERED
                await self.producer.send_event(KafkaTopic.USER_EVENTS, event_data)
            case UserLoginEventDto():
                event_data["event_type"] = EventType.USER_LOGIN
                await self.producer.send_event(KafkaTopic.USER_EVENTS, event_data)
            case TransactionEventDto():
                event_data.update(
                    {
                        "transaction_id": event.transaction_id,
                        "amount": float(event.amount),
                        "currency": event.currency,
                        "event_type": EventType.TRANSACTION,
                    }
                )
                await self.producer.send_event(KafkaTopic.TRANSACTION_EVENTS, event_data)
            case ElementClickEventDto():
                event_data.update(
                    {"element_name": event.element_name, "page": event.page, "event_type": EventType.ELEMENT_CLICK}
                )
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case SearchEventDto():
                event_data.update({"query": event.query, "event_type": EventType.SEARCH})
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case PageViewEventDto():
                event_data.update({"page": event.page, "event_type": EventType.PAGE_VIEW})
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case FormSubmitEventDto():
                event_data.update({"form_name": event.form_name, "event_type": EventType.FORM_SUBMIT})
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case ItemAddedToCartEventDto():
                event_data.update({"item_id": event.item_id, "event_type": EventType.ITEM_ADDED_TO_CART})
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case ItemRemovedFromCartEventDto():
                event_data.update({"item_id": event.item_id, "event_type": EventType.ITEM_REMOVED_FROM_CART})
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case FilterAppliedEventDto():
                event_data.update(
                    {
                        "filter_name": event.filter_name,
                        "filter_value": event.filter_value,
                        "page": event.page,
                        "event_type": EventType.FILTER_APPLIED,
                    }
                )
                await self.producer.send_event(KafkaTopic.INTERACTION_EVENTS, event_data)
            case _:
                raise ValueError(f"Unknown event: {type(event)} {event}")

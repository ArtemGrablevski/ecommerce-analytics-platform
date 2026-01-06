import asyncio
import logging

from kafka.admin import KafkaAdminClient, NewTopic
from kafka.errors import NoBrokersAvailable, TopicAlreadyExistsError

from src.enums import KafkaTopic

logger = logging.getLogger(__name__)


class KafkaAdminService:
    def __init__(self, kafka_brokers: list[str], kafka_topic_partitions: int, kafka_replication_factor: int):
        self.kafka_brokers = kafka_brokers
        self.kafka_topic_partitions = kafka_topic_partitions
        self.kafka_replication_factor = kafka_replication_factor
        self.admin_client: KafkaAdminClient | None = None

    def _get_admin_client(self) -> KafkaAdminClient:
        if not self.admin_client:
            self.admin_client = KafkaAdminClient(bootstrap_servers=self.kafka_brokers, client_id="analytics_admin")
        return self.admin_client

    async def ensure_topics_exist(self) -> None:
        topics_to_create: list[NewTopic] = []

        for topic_enum in KafkaTopic:
            topic_name = topic_enum.value
            new_topic = NewTopic(
                name=topic_name,
                num_partitions=self.kafka_topic_partitions,
                replication_factor=self.kafka_replication_factor,
            )
            topics_to_create.append(new_topic)

        if not topics_to_create:
            return

        max_retries = 30
        retry_delay = 2

        for attempt in range(max_retries):
            try:
                admin_client = self._get_admin_client()
                admin_client.create_topics(new_topics=topics_to_create, validate_only=False)
                logger.info(f"Created Kafka topics: {[t.name for t in topics_to_create]}")
                return
            except TopicAlreadyExistsError:
                logger.info("Kafka topics already exist")
                return
            except NoBrokersAvailable:
                if attempt < max_retries - 1:
                    logger.info(f"Kafka not ready, retrying in {retry_delay}s (attempt {attempt + 1}/{max_retries})")
                    await asyncio.sleep(retry_delay)
                    self.admin_client = None
                else:
                    logger.error("Kafka brokers not available after all retries")
                    raise
            except Exception as e:
                logger.error(f"Failed to create Kafka topics: {e}")
                raise

    def close(self) -> None:
        if self.admin_client:
            self.admin_client.close()
            self.admin_client = None

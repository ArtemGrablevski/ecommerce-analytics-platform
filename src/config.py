import os
from dataclasses import dataclass


@dataclass
class Config:
    kafka_bootstrap_servers: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    kafka_brokers: list[str] = None
    kafka_topic_partitions: int = int(os.getenv("KAFKA_TOPIC_PARTITIONS", "3"))
    kafka_replication_factor: int = int(os.getenv("KAFKA_REPLICATION_FACTOR", "1"))
    clickhouse_host: str = os.getenv("CLICKHOUSE_HOST", "localhost")
    clickhouse_port: int = int(os.getenv("CLICKHOUSE_PORT", "9000"))
    clickhouse_database: str = os.getenv("CLICKHOUSE_DATABASE", "analytics")
    clickhouse_user: str = os.getenv("CLICKHOUSE_USER", "default")
    clickhouse_password: str = os.getenv("CLICKHOUSE_PASSWORD", "")
    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))
    postgres_db: str = os.getenv("POSTGRES_DB", "analytics")
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    admin_bearer_token: str = os.getenv("ADMIN_BEARER_TOKEN", "admin-secret-token")
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expire_minutes: int = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))

    def __post_init__(self) -> None:
        if self.kafka_brokers is None:
            self.kafka_brokers = self.kafka_bootstrap_servers.split(",")


config = Config()

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    flask_env: str = "development"
    flask_debug: bool = True
    secret_key: str = "dev-secret-key-change-in-production-1234567890"
    jwt_secret_key: str = "dev-jwt-secret-change-in-production-1234567890"
    database_url: str = "sqlite:///debtdz.db"
    flask_cors_origins: str = "http://localhost:5173"
    log_level: str = "DEBUG"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.flask_cors_origins.split(",")]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()

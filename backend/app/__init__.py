from flask import Flask
from flask_cors import CORS

from app.core.config import settings
from app.core.database import init_db
from app.core.logging import setup_logging
from app.core.security import configure_jwt


def create_app() -> Flask:
    setup_logging()

    app = Flask(__name__)
    app.secret_key = settings.secret_key
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.database_url

    CORS(app, origins=settings.cors_origins_list)
    configure_jwt(app)

    from app.routes.auth import bp as auth_bp
    from app.routes.customers import bp as customers_bp
    from app.routes.debts import bp as debts_bp
    from app.routes.payments import bp as payments_bp
    from app.routes.dashboard import bp as dashboard_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(customers_bp)
    app.register_blueprint(debts_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(dashboard_bp)

    init_db()

    return app

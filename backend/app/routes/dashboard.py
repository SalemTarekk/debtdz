import logging

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.services.payment_service import PaymentService

bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@bp.route("/summary", methods=["GET"])
@jwt_required()
def summary():
    user_id = int(get_jwt_identity())
    db = next(get_db())
    data = PaymentService(db).dashboard_summary(user_id)
    return jsonify(data)

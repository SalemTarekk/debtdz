import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.payment import PaymentCreate
from app.services.payment_service import PaymentService

bp = Blueprint("payments", __name__, url_prefix="/api/payments")
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@bp.route("", methods=["POST"])
@jwt_required()
def create_payment():
    try:
        data = PaymentCreate(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    user_id = int(get_jwt_identity())
    db = next(get_db())
    try:
        payment = PaymentService(db).create(user_id, data)
        return jsonify({"id": payment.id, "amount": payment.amount, "note": payment.note}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.exception("Create payment error")
        return jsonify({"error": "حدث خطأ أثناء تسجيل الدفعة"}), 500


@bp.route("/by-debt/<int:debt_id>", methods=["GET"])
@jwt_required()
def list_debt_payments(debt_id: int):
    user_id = int(get_jwt_identity())
    db = next(get_db())
    payments = PaymentService(db).list_by_debt(debt_id, user_id)
    return jsonify([{
        "id": p.id, "debt_id": p.debt_id, "amount": p.amount,
        "note": p.note,
    } for p in payments])

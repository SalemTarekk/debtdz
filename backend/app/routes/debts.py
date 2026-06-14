import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.debt import DebtCreate
from app.services.debt_service import DebtService

bp = Blueprint("debts", __name__, url_prefix="/api/debts")
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@bp.route("", methods=["POST"])
@jwt_required()
def create_debt():
    try:
        data = DebtCreate(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    user_id = int(get_jwt_identity())
    db = next(get_db())
    try:
        debt = DebtService(db).create(user_id, data)
        return jsonify({"id": debt.id, "amount": debt.amount, "remaining": debt.remaining}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        logger.exception("Create debt error")
        return jsonify({"error": "حدث خطأ أثناء إضافة الدين"}), 500


@bp.route("/<int:debt_id>", methods=["GET"])
@jwt_required()
def get_debt(debt_id: int):
    user_id = int(get_jwt_identity())
    db = next(get_db())
    debt = DebtService(db).get(debt_id, user_id)
    if not debt:
        return jsonify({"error": "الدين غير موجود"}), 404
    return jsonify({
        "id": debt.id, "customer_id": debt.customer_id,
        "amount": debt.amount, "paid_amount": debt.paid_amount,
        "remaining": debt.remaining, "description": debt.description,
        "status": debt.status,
    })


@bp.route("/by-customer/<int:customer_id>", methods=["GET"])
@jwt_required()
def list_customer_debts(customer_id: int):
    user_id = int(get_jwt_identity())
    db = next(get_db())
    debts = DebtService(db).list_by_customer(customer_id, user_id)
    return jsonify([{
        "id": d.id, "customer_id": d.customer_id,
        "amount": d.amount, "paid_amount": d.paid_amount,
        "remaining": d.remaining, "description": d.description,
        "status": d.status,
    } for d in debts])

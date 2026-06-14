import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.services.customer_service import CustomerService

bp = Blueprint("customers", __name__, url_prefix="/api/customers")
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@bp.route("", methods=["GET"])
@jwt_required()
def list_customers():
    user_id = int(get_jwt_identity())
    db = next(get_db())
    customers = CustomerService(db).get_with_debt_summary(user_id)
    return jsonify([c.model_dump() for c in customers])


@bp.route("", methods=["POST"])
@jwt_required()
def create_customer():
    try:
        data = CustomerCreate(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    user_id = int(get_jwt_identity())
    db = next(get_db())
    try:
        customer = CustomerService(db).create(user_id, data)
        return jsonify({"id": customer.id, "name": customer.name, "phone": customer.phone}), 201
    except Exception as e:
        logger.exception("Create customer error")
        return jsonify({"error": "حدث خطأ أثناء إضافة العميل"}), 500


@bp.route("/<int:customer_id>", methods=["GET"])
@jwt_required()
def get_customer(customer_id: int):
    user_id = int(get_jwt_identity())
    db = next(get_db())
    customer = CustomerService(db).get(customer_id, user_id)
    if not customer:
        return jsonify({"error": "العميل غير موجود"}), 404
    return jsonify({"id": customer.id, "name": customer.name, "phone": customer.phone, "address": customer.address, "notes": customer.notes})


@bp.route("/<int:customer_id>", methods=["PUT"])
@jwt_required()
def update_customer(customer_id: int):
    try:
        data = CustomerUpdate(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    user_id = int(get_jwt_identity())
    db = next(get_db())
    customer = CustomerService(db).update(customer_id, user_id, data)
    if not customer:
        return jsonify({"error": "العميل غير موجود"}), 404
    return jsonify({"id": customer.id, "name": customer.name})


@bp.route("/<int:customer_id>", methods=["DELETE"])
@jwt_required()
def delete_customer(customer_id: int):
    user_id = int(get_jwt_identity())
    db = next(get_db())
    if not CustomerService(db).delete(customer_id, user_id):
        return jsonify({"error": "العميل غير موجود"}), 404
    return jsonify({"message": "تم حذف العميل بنجاح"})


@bp.route("/search", methods=["GET"])
@jwt_required()
def search_customers():
    query = request.args.get("q", "")
    if not query:
        return jsonify([])
    user_id = int(get_jwt_identity())
    db = next(get_db())
    customers = CustomerService(db).search(user_id, query)
    return jsonify([{"id": c.id, "name": c.name, "phone": c.phone} for c in customers])

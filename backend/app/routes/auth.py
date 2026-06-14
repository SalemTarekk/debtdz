import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth_service import AuthService

bp = Blueprint("auth", __name__, url_prefix="/api/auth")
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@bp.route("/register", methods=["POST"])
def register():
    try:
        data = RegisterRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    db = next(get_db())
    try:
        user = AuthService(db).register(data)
        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        logger.exception("Register error")
        return jsonify({"error": "حدث خطأ أثناء التسجيل"}), 500


@bp.route("/login", methods=["POST"])
def login():
    try:
        data = LoginRequest(**request.get_json())
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400

    db = next(get_db())
    try:
        user = AuthService(db).login(data.email, data.password)
        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token, "user": {"id": user.id, "name": user.name, "email": user.email}})
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        logger.exception("Login error")
        return jsonify({"error": "حدث خطأ أثناء تسجيل الدخول"}), 500


@bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    db = next(get_db())
    from app.models.user import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return jsonify({"error": "المستخدم غير موجود"}), 404
    return jsonify({"id": user.id, "name": user.name, "email": user.email})

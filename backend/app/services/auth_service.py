import logging

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import RegisterRequest

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, data: RegisterRequest) -> User:
        existing = self.db.query(User).filter(User.email == data.email).first()
        if existing:
            raise ValueError("البريد الإلكتروني مستخدم بالفعل")
        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        logger.info("User registered: %s", user.email)
        return user

    def login(self, email: str, password: str) -> User:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise ValueError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        logger.info("User logged in: %s", user.email)
        return user

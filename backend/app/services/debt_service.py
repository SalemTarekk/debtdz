import logging

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.debt import Debt
from app.schemas.debt import DebtCreate

logger = logging.getLogger(__name__)


class DebtService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data: DebtCreate) -> Debt:
        customer = self.db.query(Customer).filter(
            Customer.id == data.customer_id, Customer.user_id == user_id
        ).first()
        if not customer:
            raise ValueError("العميل غير موجود")
        debt = Debt(
            customer_id=data.customer_id,
            user_id=user_id,
            amount=data.amount,
            description=data.description,
        )
        self.db.add(debt)
        self.db.commit()
        self.db.refresh(debt)
        logger.info("Debt created: %d DZD for customer %d", data.amount, data.customer_id)
        return debt

    def get(self, debt_id: int, user_id: int) -> Debt | None:
        return self.db.query(Debt).filter(
            Debt.id == debt_id, Debt.user_id == user_id
        ).first()

    def list_by_customer(self, customer_id: int, user_id: int) -> list[Debt]:
        return self.db.query(Debt).join(Customer).filter(
            Debt.customer_id == customer_id, Customer.user_id == user_id
        ).all()

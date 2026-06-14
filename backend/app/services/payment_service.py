import logging

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.debt import Debt
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate

logger = logging.getLogger(__name__)


class PaymentService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data: PaymentCreate) -> Payment:
        debt = self.db.query(Debt).filter(
            Debt.id == data.debt_id, Debt.user_id == user_id
        ).first()
        if not debt:
            raise ValueError("الدين غير موجود")
        if data.amount > debt.remaining:
            raise ValueError("المبلغ يتجاوز المتبقي من الدين")

        payment = Payment(
            debt_id=data.debt_id,
            customer_id=data.customer_id,
            user_id=user_id,
            amount=data.amount,
            note=data.note,
        )
        debt.paid_amount += data.amount
        if debt.remaining == 0:
            debt.status = "paid"

        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        logger.info("Payment recorded: %d DZD on debt %d", data.amount, data.debt_id)
        return payment

    def list_by_debt(self, debt_id: int, user_id: int) -> list[Payment]:
        return self.db.query(Payment).join(Debt).filter(
            Payment.debt_id == debt_id, Debt.user_id == user_id
        ).all()

    def dashboard_summary(self, user_id: int) -> dict:
        from sqlalchemy import func as sqlfunc

        debts = self.db.query(Debt).filter(Debt.user_id == user_id)
        total_debts = debts.with_entities(sqlfunc.coalesce(sqlfunc.sum(Debt.amount), 0)).scalar()
        total_paid = debts.with_entities(sqlfunc.coalesce(sqlfunc.sum(Debt.paid_amount), 0)).scalar()

        customers_count = self.db.query(Customer).filter(Customer.user_id == user_id).count()
        active_debts = debts.filter(Debt.status == "active").count()

        return {
            "total_debts": total_debts,
            "total_paid": total_paid,
            "outstanding": total_debts - total_paid,
            "active_customers": customers_count,
            "active_debts": active_debts,
        }

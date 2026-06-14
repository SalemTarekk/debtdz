import logging

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.debt import Debt
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerWithDebtResponse

logger = logging.getLogger(__name__)


class CustomerService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, data: CustomerCreate) -> Customer:
        customer = Customer(**data.model_dump(), user_id=user_id)
        self.db.add(customer)
        self.db.commit()
        self.db.refresh(customer)
        logger.info("Customer created: %s", customer.name)
        return customer

    def list_by_user(self, user_id: int) -> list[Customer]:
        return self.db.query(Customer).filter(Customer.user_id == user_id).all()

    def get(self, customer_id: int, user_id: int) -> Customer | None:
        return self.db.query(Customer).filter(
            Customer.id == customer_id, Customer.user_id == user_id
        ).first()

    def update(self, customer_id: int, user_id: int, data: CustomerUpdate) -> Customer | None:
        customer = self.get(customer_id, user_id)
        if not customer:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(customer, key, value)
        self.db.commit()
        self.db.refresh(customer)
        logger.info("Customer updated: %s", customer.name)
        return customer

    def delete(self, customer_id: int, user_id: int) -> bool:
        customer = self.get(customer_id, user_id)
        if not customer:
            return False
        self.db.delete(customer)
        self.db.commit()
        logger.info("Customer deleted: id=%d", customer_id)
        return True

    def search(self, user_id: int, query: str) -> list[Customer]:
        q = f"%{query}%"
        return self.db.query(Customer).filter(
            Customer.user_id == user_id,
            or_(Customer.name.ilike(q), Customer.phone.ilike(q)),
        ).all()

    def get_with_debt_summary(self, user_id: int) -> list[CustomerWithDebtResponse]:
        customers = self.list_by_user(user_id)
        result = []
        for c in customers:
            debts = self.db.query(Debt).filter(Debt.customer_id == c.id).all()
            total_debt = sum(d.amount for d in debts)
            total_paid = sum(d.paid_amount for d in debts)
            result.append(CustomerWithDebtResponse(
                id=c.id, user_id=c.user_id, name=c.name,
                phone=c.phone, address=c.address, notes=c.notes,
                total_debt=total_debt, total_paid=total_paid,
                remaining=total_debt - total_paid,
            ))
        return result

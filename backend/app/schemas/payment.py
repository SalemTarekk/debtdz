from pydantic import BaseModel


class PaymentCreate(BaseModel):
    debt_id: int
    customer_id: int
    amount: int
    note: str = ""


class PaymentResponse(BaseModel):
    id: int
    debt_id: int
    customer_id: int
    user_id: int
    amount: int
    note: str

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    total_debts: int = 0
    total_paid: int = 0
    outstanding: int = 0
    active_customers: int = 0
    active_debts: int = 0

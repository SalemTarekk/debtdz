from pydantic import BaseModel


class DebtCreate(BaseModel):
    customer_id: int
    amount: int
    description: str = ""


class DebtResponse(BaseModel):
    id: int
    customer_id: int
    user_id: int
    amount: int
    paid_amount: int
    remaining: int
    description: str
    status: str

    model_config = {"from_attributes": True}

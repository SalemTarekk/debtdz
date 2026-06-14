from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    phone: str
    address: str = ""
    notes: str = ""


class CustomerUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    address: str | None = None
    notes: str | None = None


class CustomerResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone: str
    address: str
    notes: str

    model_config = {"from_attributes": True}


class CustomerWithDebtResponse(CustomerResponse):
    total_debt: int = 0
    total_paid: int = 0
    remaining: int = 0

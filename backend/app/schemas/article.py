from datetime import datetime

from pydantic import BaseModel


class ArticleResponse(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ArticleListResponse(BaseModel):
    id: int
    title: str
    slug: str
    created_at: datetime

    model_config = {"from_attributes": True}

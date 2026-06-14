import logging

from sqlalchemy.orm import Session

from app.models.article import Article

logger = logging.getLogger(__name__)


class ArticleService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Article]:
        return self.db.query(Article).order_by(Article.created_at.desc()).all()

    def get_by_slug(self, slug: str) -> Article | None:
        return self.db.query(Article).filter(Article.slug == slug).first()

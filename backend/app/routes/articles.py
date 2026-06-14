import logging

from flask import Blueprint, jsonify
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.services.article_service import ArticleService

bp = Blueprint("articles", __name__, url_prefix="/api/articles")
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@bp.route("", methods=["GET"])
def list_articles():
    db = next(get_db())
    articles = ArticleService(db).list_all()
    return jsonify([{
        "id": a.id, "title": a.title, "slug": a.slug,
        "created_at": a.created_at.isoformat(),
    } for a in articles])


@bp.route("/<slug>", methods=["GET"])
def get_article(slug: str):
    db = next(get_db())
    article = ArticleService(db).get_by_slug(slug)
    if not article:
        return jsonify({"error": "المقال غير موجود"}), 404
    return jsonify({
        "id": article.id, "title": article.title, "slug": article.slug,
        "content": article.content,
        "created_at": article.created_at.isoformat(),
    })

import logging
from datetime import datetime

from flask import Blueprint, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.services.article_service import ArticleService

bp = Blueprint("sitemap", __name__)
logger = logging.getLogger(__name__)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _url(tag: str, base: str, lastmod: str | None = None) -> str:
    parts = [f"  <loc>{base}{tag}</loc>"]
    if lastmod:
        parts.append(f"  <lastmod>{lastmod}</lastmod>")
    parts.append("  <changefreq>weekly</changefreq>")
    parts.append("  <priority>0.8</priority>")
    return "<url>\n" + "\n".join(parts) + "\n</url>"


@bp.route("/sitemap.xml", methods=["GET"])
def sitemap():
    base = settings.flask_cors_origins.split(",")[0].strip().rstrip("/")
    if not base or "localhost" in base:
        base = "https://debtdz.vercel.app"

    today = datetime.utcnow().strftime("%Y-%m-%d")

    urls = [
        _url("", base, today),
        _url("/login", base, today),
        _url("/register", base, today),
        _url("/blog", base, today),
    ]

    db = next(get_db())
    articles = ArticleService(db).list_all()
    for a in articles:
        lastmod = a.created_at.strftime("%Y-%m-%d")
        urls.append(_url(f"/blog/{a.slug}", base, lastmod))

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += "\n".join(urls)
    xml += "\n</urlset>"

    return Response(xml, mimetype="application/xml")

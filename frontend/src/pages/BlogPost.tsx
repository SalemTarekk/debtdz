import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { ar } from '../lib/arabic';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/articles/${slug}`).then((r) => {
      setArticle(r.data);
      setLoading(false);
    }).catch((err) => {
      if (err.response?.status === 404) setNotFound(true);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-gray-500">{ar.loading}</div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link to="/blog" className="text-blue-600 text-sm hover:underline">&larr; {ar.blog}</Link>
          <div className="text-center py-16 text-gray-500">{ar.notFound}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-blue-600">{ar.appName}</Link>
          <Link to="/blog" className="text-sm text-gray-600 hover:text-blue-600">{ar.blog}</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/blog" className="text-blue-600 text-sm hover:underline">&larr; {ar.backToBlog}</Link>
        <article className="mt-4 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
          <p className="text-sm text-gray-400 mb-6">
            {new Date(article.created_at).toLocaleDateString('ar-DZ')}
          </p>
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </article>
      </main>
    </div>
  );
}

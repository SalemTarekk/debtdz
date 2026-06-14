import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { ar } from '../lib/arabic';

interface Article {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export default function BlogList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/articles').then((r) => {
      setArticles(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-blue-600">{ar.appName}</Link>
          <Link to="/blog" className="text-sm text-gray-600 hover:text-blue-600">{ar.blog}</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{ar.blog}</h1>
        {loading ? (
          <div className="text-center py-8 text-gray-500">{ar.loading}</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{ar.noArticles}</div>
        ) : (
          <div className="space-y-4">
            {articles.map((a) => (
              <Link key={a.id} to={`/blog/${a.slug}`}
                className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition">
                <h2 className="text-lg font-semibold">{a.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(a.created_at).toLocaleDateString('ar-DZ')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

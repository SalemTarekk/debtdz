import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ar } from '../lib/arabic';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (error: any) {
      setErr(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">{ar.register}</h1>
        {err && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{err}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{ar.name}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{ar.email}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">{ar.password}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
          {loading ? ar.loading : ar.register}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          {ar.login} <Link to="/login" className="text-blue-600">تسجيل الدخول</Link>
        </p>
      </form>
    </div>
  );
}

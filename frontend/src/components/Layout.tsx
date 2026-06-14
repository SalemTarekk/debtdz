import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ar } from '../lib/arabic';
import { useAuth } from '../hooks/useAuth';

const nav = [
  { to: '/', label: ar.dashboard },
  { to: '/customers', label: ar.customers },
  { to: '/blog', label: ar.blog },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold text-blue-600">{ar.appName}</Link>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm ${location.pathname === item.to ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">{ar.logout}</button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

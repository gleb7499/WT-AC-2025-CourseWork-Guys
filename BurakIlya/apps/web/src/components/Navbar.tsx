import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          🤲 Помощь рядом
        </Link>

        {isAuthenticated && user ? (
          <ul className="navbar-nav">
            <li>
              <Link to="/" className="navbar-link">
                Главная
              </Link>
            </li>

            {user.role === 'user' && (
              <li>
                <Link to="/my-requests" className="navbar-link">
                  Мои запросы
                </Link>
              </li>
            )}

            {user.role === 'volunteer' && (
              <>
                <li>
                  <Link to="/available-requests" className="navbar-link">
                    Доступные запросы
                  </Link>
                </li>
                <li>
                  <Link to="/my-assignments" className="navbar-link">
                    Мои задания
                  </Link>
                </li>
              </>
            )}

            {user.role === 'admin' && (
              <li>
                <Link to="/admin" className="navbar-link">
                  Админ-панель
                </Link>
              </li>
            )}

            <li>
              <span className="navbar-link">{user.username} ({user.role})</span>
            </li>

            <li>
              <button onClick={handleLogout} className="btn btn-secondary">
                Выход
              </button>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav">
            <li>
              <Link to="/login" className="navbar-link">
                Вход
              </Link>
            </li>
            <li>
              <Link to="/register" className="navbar-link">
                Регистрация
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏫 Бронирование аудиторий
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Главная</Link>
          <Link to="/rooms" className="navbar-link">Аудитории</Link>
          <Link to="/bookings" className="navbar-link">Мои бронирования</Link>
          <Link to="/schedule" className="navbar-link">Расписание</Link>
          
          {user.role === 'ADMIN' && (
            <>
              <Link to="/admin/users" className="navbar-link">Пользователи</Link>
              <Link to="/admin/rooms" className="navbar-link">Управление аудиториями</Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            {user.username} ({user.role})
          </span>
          <button 
            onClick={handleLogout} 
            className="logout-button"
            aria-label="Выйти из системы"
          >
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
}

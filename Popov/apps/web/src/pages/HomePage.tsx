import { Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import './HomePage.css';

export function HomePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  const getMaxBookingTime = () => {
    if (user.role === 'ADMIN') return 'неограниченно';
    if (user.role === 'TEACHER') return '4 часа';
    return '2 часа';
  };

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Добро пожаловать, {user.username}!</h1>
        <p className="hero-subtitle">
          Система бронирования аудиторий - забронируйте аудиторию до того, как её займут другие!
        </p>
      </section>

      <section className="user-info-card">
        <h2>Ваш аккаунт</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Роль:</strong> {user.role}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="info-item">
            <strong>Максимальное время бронирования:</strong> {getMaxBookingTime()}
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <h2>Быстрые действия</h2>
        <div className="action-grid">
          <Link to="/rooms" className="action-card">
            <span className="action-icon">🏢</span>
            <h3>Просмотр аудиторий</h3>
            <p>Найдите подходящую аудиторию</p>
          </Link>

          <Link to="/schedule" className="action-card">
            <span className="action-icon">📅</span>
            <h3>Расписание</h3>
            <p>Посмотрите занятость аудиторий</p>
          </Link>

          <Link to="/bookings" className="action-card">
            <span className="action-icon">📋</span>
            <h3>Мои бронирования</h3>
            <p>Управляйте своими бронированиями</p>
          </Link>

          {user.role === 'ADMIN' && (
            <>
              <Link to="/admin/users" className="action-card admin">
                <span className="action-icon">👥</span>
                <h3>Пользователи</h3>
                <p>Управление пользователями</p>
              </Link>

              <Link to="/admin/rooms" className="action-card admin">
                <span className="action-icon">⚙️</span>
                <h3>Управление аудиториями</h3>
                <p>Добавить/изменить аудитории</p>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Возможности системы</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>✅ Предотвращение конфликтов</h3>
            <p>Система автоматически проверяет доступность аудитории</p>
          </div>
          <div className="feature-item">
            <h3>⏱️ Ограничения по времени</h3>
            <p>Разные лимиты для студентов и преподавателей</p>
          </div>
          <div className="feature-item">
            <h3>📊 Фильтрация</h3>
            <p>Поиск по вместимости, оборудованию и расположению</p>
          </div>
          <div className="feature-item">
            <h3>🔄 Перенос бронирований</h3>
            <p>Измените время с автоматической проверкой конфликтов</p>
          </div>
        </div>
      </section>
    </div>
  );
}

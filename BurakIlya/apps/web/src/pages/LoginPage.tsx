import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../features/auth/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      const { accessToken, refreshToken, user } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { error?: { message?: string } } } };
        setError(error.response?.data?.error?.message || 'Ошибка входа');
      } else {
        setError('Ошибка входа');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1.5rem' }}>Вход</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              aria-required="true"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

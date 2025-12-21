import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { requestsApi, categoriesApi } from '../api';
import { HelpRequest, Category } from '../shared/types';
import Layout from '../components/Layout';

export default function HomePage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsRes, categoriesRes] = await Promise.all([
        requestsApi.list({ status: 'new', limit: 10 }),
        categoriesApi.list({ limit: 100 }),
      ]);
      setRequests(requestsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="loading">Загрузка...</div></Layout>;
  if (error) return <Layout><div className="alert alert-error">{error}</div></Layout>;

  return (
    <Layout>
      <h1 style={{ marginBottom: '2rem' }}>Главная</h1>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Добро пожаловать, {user?.username}!</h2>
        <p>Роль: <strong>{user?.role}</strong></p>

        {user?.role === 'user' && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/requests/create" className="btn btn-primary">
              Создать запрос помощи
            </Link>
          </div>
        )}

        {user?.role === 'volunteer' && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/available-requests" className="btn btn-primary">
              Посмотреть доступные запросы
            </Link>
          </div>
        )}

        {user?.role === 'admin' && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/admin" className="btn btn-primary">
              Перейти в админ-панель
            </Link>
          </div>
        )}
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Категории помощи</h2>
      <div className="grid grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{category.icon}</div>
            <h3>{category.name}</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{category.description}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Новые запросы помощи</h2>
      {requests.length === 0 ? (
        <div className="card">
          <p>Нет новых запросов</p>
        </div>
      ) : (
        <div className="grid">
          {requests.map((request) => (
            <div key={request.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{request.title}</h3>
                  <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)' }}>{request.description}</p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <span>📍 {request.locationAddress}</span>
                    {request.category && (
                      <span style={{ marginLeft: '1rem' }}>
                        {request.category.icon} {request.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`status-badge status-${request.status}`}>{request.status}</span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Link to={`/requests/${request.id}`} className="btn btn-primary">
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

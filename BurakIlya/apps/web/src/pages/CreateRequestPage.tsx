import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestsApi, categoriesApi } from '../api';
import { Category } from '../shared/types';
import Layout from '../components/Layout';

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    locationAddress: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesApi.list({ limit: 100 }).then((res) => setCategories(res.data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestsApi.create(formData);
      navigate('/my-requests');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { error?: { message?: string } } } };
        setError(error.response?.data?.error?.message || 'Ошибка создания запроса');
      } else {
        setError('Ошибка создания запроса');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Создать запрос помощи</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Заголовок</label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                minLength={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Описание</label>
              <textarea
                id="description"
                className="form-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                minLength={10}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="categoryId">Категория</label>
              <select
                id="categoryId"
                className="form-select"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="locationAddress">Адрес</label>
              <input
                id="locationAddress"
                type="text"
                className="form-input"
                value={formData.locationAddress}
                onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Создание...' : 'Создать запрос'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

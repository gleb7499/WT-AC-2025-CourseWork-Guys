import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { HelpRequest, PaginatedResponse } from "../types";
import { useAuth } from "../contexts/AuthContext";

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.requests
      .list()
      .then((data: PaginatedResponse<HelpRequest>) => {
        setRequests(data.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Загрузка...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>Ошибка: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1>Запросы помощи</h1>
        <Link to="/requests/new">
          <button style={{ padding: "8px 16px" }}>Создать запрос</button>
        </Link>
      </div>
      {requests.length === 0 ? (
        <p>Нет запросов</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {requests.map((req) => (
            <div key={req.id} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
              <h3>{req.title}</h3>
              <p>{req.description}</p>
              <p>
                <strong>Статус:</strong> {req.status}
              </p>
              {req.category && (
                <p>
                  <strong>Категория:</strong> {req.category.name}
                </p>
              )}
              <p>
                <strong>Адрес:</strong> {req.locationAddress}
              </p>
              <Link to={`/requests/${req.id}`}>
                <button style={{ padding: "4px 12px", marginTop: 8 }}>Подробнее</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

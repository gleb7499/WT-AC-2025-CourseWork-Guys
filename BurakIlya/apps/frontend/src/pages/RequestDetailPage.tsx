import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { HelpRequest } from "../types";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volunteering, setVolunteering] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.requests
      .get(id)
      .then(setRequest)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVolunteer = async () => {
    if (!id) return;
    setVolunteering(true);
    try {
      await api.assignments.create({ requestId: id });
      alert("Вы откликнулись на запрос!");
      navigate("/assignments");
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Ошибка: ${err.message}`);
      }
    } finally {
      setVolunteering(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Загрузка...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>Ошибка: {error}</div>;
  if (!request) return <div style={{ padding: 24 }}>Запрос не найден</div>;

  const isOwner = user?.id === request.userId;
  const canVolunteer = !isOwner && request.status === "new";

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", padding: 24 }}>
      <h1>{request.title}</h1>
      <p>{request.description}</p>
      <p>
        <strong>Статус:</strong> {request.status}
      </p>
      <p>
        <strong>Адрес:</strong> {request.locationAddress}
      </p>
      {canVolunteer && (
        <button
          onClick={handleVolunteer}
          disabled={volunteering}
          style={{ padding: "8px 16px", marginTop: 16 }}
        >
          {volunteering ? "Откликаюсь..." : "Откликнуться"}
        </button>
      )}
      <button onClick={() => navigate("/")} style={{ padding: "8px 16px", marginTop: 16, marginLeft: 8 }}>
        Назад
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Assignment } from "../types";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.assignments
      .list()
      .then((data) => setAssignments(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.assignments.update(id, { status: newStatus });
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
      );
      alert("Статус обновлён");
    } catch (err) {
      alert("Ошибка обновления");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Мои назначения</h1>
      {assignments.length === 0 ? (
        <p>Нет назначений</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {assignments.map((a) => (
            <div key={a.id} style={{ border: "1px solid #ccc", padding: 16, borderRadius: 4 }}>
              <p>
                <strong>Запрос:</strong> {a.request?.title || a.requestId}
              </p>
              <p>
                <strong>Статус:</strong> {a.status}
              </p>
              <p>
                <strong>Назначен:</strong> {new Date(a.assignedAt).toLocaleString()}
              </p>
              {a.status === "assigned" && (
                <button
                  onClick={() => handleStatusChange(a.id, "in_progress")}
                  style={{ padding: "4px 12px", marginTop: 8 }}
                >
                  Начать выполнение
                </button>
              )}
              {a.status === "in_progress" && (
                <button
                  onClick={() => handleStatusChange(a.id, "completed")}
                  style={{ padding: "4px 12px", marginTop: 8 }}
                >
                  Завершить
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

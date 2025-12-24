import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { VolunteerProfile } from "../types";

export default function VolunteerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.volunteers
      .list()
      .then((data) => {
        const myProfile = data.items.find((p: VolunteerProfile) => p.userId === user.id);
        setProfile(myProfile || null);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreateProfile = async () => {
    setCreating(true);
    try {
      const result = await api.volunteers.create({ bio: "Готов помочь" });
      setProfile(result);
    } catch (err) {
      alert("Ошибка создания профиля");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Загрузка...</div>;

  if (!profile) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Профиль волонтёра</h1>
        <p>У вас ещё нет профиля волонтёра.</p>
        <button onClick={handleCreateProfile} disabled={creating} style={{ padding: "8px 16px" }}>
          {creating ? "Создание..." : "Создать профиль"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Профиль волонтёра</h1>
      <p>
        <strong>Био:</strong> {profile.bio || "Не указано"}
      </p>
      <p>
        <strong>Рейтинг:</strong> {profile.rating.toFixed(1)}
      </p>
      <p>
        <strong>Помогли раз:</strong> {profile.totalHelps}
      </p>
      <Link to="/assignments">
        <button style={{ padding: "8px 16px", marginTop: 16 }}>Мои назначения</button>
      </Link>
    </div>
  );
}

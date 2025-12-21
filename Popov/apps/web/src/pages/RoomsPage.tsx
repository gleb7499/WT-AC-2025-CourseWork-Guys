import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi } from '../api';
import type { Room } from '../shared/types';
import './RoomsPage.css';

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    capacity: '',
    equipment: '',
    location: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await roomsApi.getAll({
        capacity: filters.capacity ? Number(filters.capacity) : undefined,
        equipment: filters.equipment || undefined,
        location: filters.location || undefined,
      });
      setRooms(response.data.data?.items || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Ошибка загрузки аудиторий');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    fetchRooms();
  };

  const handleCreateBooking = (roomId: string) => {
    navigate(`/bookings/create?roomId=${roomId}`);
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="rooms-page">
      <h1>Аудитории</h1>

      <div className="filters-card">
        <h2>Фильтры</h2>
        <div className="filters-form">
          <div className="filter-group">
            <label htmlFor="capacity">Минимальная вместимость</label>
            <input
              type="number"
              id="capacity"
              value={filters.capacity}
              onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              placeholder="Например, 20"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="equipment">Оборудование</label>
            <input
              type="text"
              id="equipment"
              value={filters.equipment}
              onChange={(e) => setFilters({ ...filters, equipment: e.target.value })}
              placeholder="Например, проектор"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="location">Расположение</label>
            <input
              type="text"
              id="location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Например, корпус А"
            />
          </div>

          <button onClick={handleFilter} className="filter-button">
            Применить фильтры
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <p className="no-results">Аудитории не найдены</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h3>{room.name}</h3>
              {room.description && <p className="room-description">{room.description}</p>}
              <div className="room-details">
                <div className="detail-item">
                  <strong>Вместимость:</strong> {room.capacity} человек
                </div>
                {room.equipment && (
                  <div className="detail-item">
                    <strong>Оборудование:</strong> {room.equipment}
                  </div>
                )}
                <div className="detail-item">
                  <strong>Расположение:</strong> {room.location}
                </div>
              </div>
              <button
                onClick={() => handleCreateBooking(room.id)}
                className="book-button"
                aria-label={`Забронировать ${room.name}`}
              >
                Забронировать
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

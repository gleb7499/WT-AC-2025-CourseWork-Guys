import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { roomsApi, bookingsApi, scheduleApi } from '../api';
import type { Room } from '../shared/types';
import './CreateBookingPage.css';

export function CreateBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(searchParams.get('roomId') || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [conflictMessage, setConflictMessage] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.getAll();
      setRooms(response.data.data?.items || []);
    } catch (err) {
      alert('Ошибка загрузки аудиторий');
    }
  };

  const checkConflicts = async () => {
    if (!selectedRoomId || !startTime || !endTime) return;

    try {
      const response = await scheduleApi.checkConflicts({
        roomId: selectedRoomId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      if (response.data.data?.hasConflicts) {
        setConflictMessage('Это время уже занято!');
      } else {
        setConflictMessage('');
      }
    } catch (err) {
      // Ignore conflict check errors
    }
  };

  useEffect(() => {
    if (selectedRoomId && startTime && endTime) {
      checkConflicts();
    }
  }, [selectedRoomId, startTime, endTime]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedRoomId) newErrors.roomId = 'Выберите аудиторию';
    if (!startTime) newErrors.startTime = 'Укажите время начала';
    if (!endTime) newErrors.endTime = 'Укажите время окончания';
    if (!purpose) newErrors.purpose = 'Укажите цель бронирования';

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      newErrors.endTime = 'Время окончания должно быть позже начала';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await bookingsApi.create({
        roomId: selectedRoomId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        purpose,
      });

      alert('Бронирование создано успешно!');
      navigate('/bookings');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Ошибка создания бронирования');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-booking-page">
      <h1>Создать бронирование</h1>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="roomId">Аудитория *</label>
          <select
            id="roomId"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className={errors.roomId ? 'input-error' : ''}
          >
            <option value="">Выберите аудиторию</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.location} (вместимость: {room.capacity})
              </option>
            ))}
          </select>
          {errors.roomId && <span className="field-error">{errors.roomId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Время начала *</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={errors.startTime ? 'input-error' : ''}
          />
          {errors.startTime && <span className="field-error">{errors.startTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endTime">Время окончания *</label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={errors.endTime ? 'input-error' : ''}
          />
          {errors.endTime && <span className="field-error">{errors.endTime}</span>}
        </div>

        {conflictMessage && (
          <div className="conflict-warning" role="alert">
            {conflictMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="purpose">Цель бронирования *</label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={errors.purpose ? 'input-error' : ''}
            rows={3}
            placeholder="Например: Лекция по математике"
            maxLength={500}
          />
          {errors.purpose && <span className="field-error">{errors.purpose}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/rooms')} className="cancel-btn">
            Отмена
          </button>
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Создание...' : 'Создать бронирование'}
          </button>
        </div>
      </form>
    </div>
  );
}

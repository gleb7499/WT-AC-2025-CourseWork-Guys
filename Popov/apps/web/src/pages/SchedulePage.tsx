import { useState, useEffect } from 'react';
import { scheduleApi } from '../api';
import type { Booking } from '../shared/types';
import { formatDate, formatTime } from '../shared/utils';
import './SchedulePage.css';

export function SchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateObj = new Date(selectedDate);
      const response = await scheduleApi.get({
        date: dateObj.toISOString(),
      });
      setBookings(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Ошибка загрузки расписания');
    } finally {
      setIsLoading(false);
    }
  };

  const groupBookingsByRoom = () => {
    const grouped: Record<string, Booking[]> = {};
    bookings.forEach((booking) => {
      const roomName = booking.room?.name || 'Unknown';
      if (!grouped[roomName]) {
        grouped[roomName] = [];
      }
      grouped[roomName].push(booking);
    });
    return grouped;
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  const groupedBookings = groupBookingsByRoom();

  return (
    <div className="schedule-page">
      <h1>Расписание занятости аудиторий</h1>

      <div className="schedule-controls">
        <div className="date-selector">
          <label htmlFor="date">Выберите дату:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>На {formatDate(selectedDate)} нет бронирований</p>
        </div>
      ) : (
        <div className="schedule-grid">
          {Object.entries(groupedBookings).map(([roomName, roomBookings]) => (
            <div key={roomName} className="room-schedule">
              <h3>{roomName}</h3>
              <div className="bookings-timeline">
                {roomBookings
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map((booking) => (
                    <div key={booking.id} className="timeline-item">
                      <div className="time-slot">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                      <div className="booking-info">
                        <div className="purpose">{booking.purpose}</div>
                        <div className="user">{booking.user?.username}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { bookingsApi } from '../api';
import { useAuthStore } from '../features/auth/authStore';
import type { Booking } from '../shared/types';
import { formatDateTime, formatDuration, isBookingUpcoming } from '../shared/utils';
import './BookingsPage.css';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.getAll({
        userId: user.id,
        status: 'ACTIVE',
      });
      setBookings(response.data.data?.items || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Ошибка загрузки бронирований');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      await bookingsApi.delete(id);
      alert('Бронирование отменено');
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Ошибка при отмене бронирования');
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="bookings-page">
      <h1>Мои бронирования</h1>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет активных бронирований</p>
          <a href="/rooms" className="create-button">Забронировать аудиторию</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.room?.name || 'Аудитория'}</h3>
                {isBookingUpcoming(booking) && (
                  <span className="status-badge upcoming">Предстоящее</span>
                )}
              </div>
              
              <div className="booking-details">
                <div className="detail-row">
                  <strong>Дата и время:</strong>
                  <span>{formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime).split(' ')[1]}</span>
                </div>
                <div className="detail-row">
                  <strong>Продолжительность:</strong>
                  <span>{formatDuration(booking.startTime, booking.endTime)}</span>
                </div>
                <div className="detail-row">
                  <strong>Цель:</strong>
                  <span>{booking.purpose}</span>
                </div>
                {booking.room?.location && (
                  <div className="detail-row">
                    <strong>Расположение:</strong>
                    <span>{booking.room.location}</span>
                  </div>
                )}
              </div>

              <div className="booking-actions">
                {isBookingUpcoming(booking) && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="cancel-button"
                    aria-label={`Отменить бронирование ${booking.room?.name}`}
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

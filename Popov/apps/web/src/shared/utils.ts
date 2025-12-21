export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function formatDuration(startTime: string | Date, endTime: string | Date): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (minutes === 0) {
    return `${hours} ч`;
  }
  return `${hours} ч ${minutes} мин`;
}

export function isBookingActive(booking: { startTime: string; endTime: string; status: string }): boolean {
  if (booking.status !== 'ACTIVE') return false;
  const now = new Date();
  const end = new Date(booking.endTime);
  return end > now;
}

export function isBookingUpcoming(booking: { startTime: string; status: string }): boolean {
  if (booking.status !== 'ACTIVE') return false;
  const now = new Date();
  const start = new Date(booking.startTime);
  return start > now;
}

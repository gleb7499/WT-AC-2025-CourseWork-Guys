import { useState, useEffect } from 'react';
import { roomsApi } from '../api';
import type { Room, CreateRoomData } from '../shared/types';
import './AdminRoomsPage.css';

export function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<CreateRoomData>({
    name: '',
    description: '',
    capacity: 0,
    equipment: '',
    location: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await roomsApi.getAll();
      setRooms(response.data.data?.items || []);
    } catch (err) {
      alert('Ошибка загрузки аудиторий');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRoom) {
        await roomsApi.update(editingRoom.id, formData);
        alert('Аудитория обновлена');
      } else {
        await roomsApi.create(formData);
        alert('Аудитория создана');
      }
      setShowForm(false);
      setEditingRoom(null);
      resetForm();
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Ошибка сохранения');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      capacity: room.capacity,
      equipment: room.equipment || '',
      location: room.location,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить аудиторию?')) return;

    try {
      await roomsApi.delete(id);
      alert('Аудитория удалена');
      fetchRooms();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Ошибка удаления');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: 0,
      equipment: '',
      location: '',
    });
  };

  if (isLoading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="admin-rooms-page">
      <h1>Управление аудиториями</h1>

      <button onClick={() => setShowForm(!showForm)} className="add-button">
        {showForm ? 'Отмена' : 'Добавить аудиторию'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="room-form">
          <input
            type="text"
            placeholder="Название *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Вместимость *"
            value={formData.capacity || ''}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            required
          />
          <input
            type="text"
            placeholder="Оборудование"
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
          />
          <input
            type="text"
            placeholder="Расположение *"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <button type="submit">{editingRoom ? 'Обновить' : 'Создать'}</button>
        </form>
      )}

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-item">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <div className="room-meta">
              Вместимость: {room.capacity} | {room.location}
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(room)}>Изменить</button>
              <button onClick={() => handleDelete(room.id)} className="delete">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

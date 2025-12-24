# Frontend (SPA)

React + TypeScript + Vite. Использует backend как единственный источник правды.

## Запуск

Из корня репо:

```bash
npm install
npm run dev -w frontend
```

Переменные окружения (apps/frontend/.env):
```
VITE_API_URL=http://localhost:4000
```

## Функциональность
- Login / Register (JWT в памяти, Context)
- Запросы помощи: список, создание, редактирование, удаление (права: владелец или admin)
- Категории: CRUD только admin
- Волонтёры: создание профиля, редактирование/удаление своего; admin может любого
- Назначения: отклик волонтёра, назначение admin, смена статуса, удаление admin
- Отзывы: создание после completed Assignment, редактирование/удаление автором или admin
- Учитываются роли: скрытие недоступных действий, сообщения об ошибках от backend
- Состояния loading / error / empty для списков

## Тестовые пользователи (seed backend)
- admin@example.com / admin123
- user@example.com / user12345
- volunteer@example.com / volunteer123

## Навигация
- /login, /register
- /requests (главный экран)
- /categories, /volunteers, /assignments, /reviews

## Примечания
- Токен хранится в памяти (context), после перезагрузки нужно войти снова.
- Все запросы идут на backend, права проверяются сервером.

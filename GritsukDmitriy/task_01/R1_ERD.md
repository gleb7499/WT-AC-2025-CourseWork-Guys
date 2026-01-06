# Вариант 24 — ERD (диаграмма сущностей) — Roadmaps «Как стать джуном»

Файл содержит: 1) mermaid-диаграмму ERD; 2) ASCII-эскиз; 3) минимальный SQL DDL-скетч для создания таблиц.

## Mermaid ERD

```mermaid
erDiagram
    USER ||--o{ PROGRESS : tracks
    ROADMAP ||--o{ STEP : contains
    STEP ||--o{ RESOURCE : has
    STEP ||--o{ PROGRESS : completed_by

    USER {
        id int PK
        username varchar
        password_hash varchar
        role varchar
    }
    ROADMAP {
        id int PK
        title varchar
        description text
        created_at datetime
    }
    STEP {
        id int PK
        roadmap_id int FK
        title varchar
        description text
        order int
    }
    RESOURCE {
        id int PK
        step_id int FK
        title varchar
        url varchar
        type varchar
    }
    PROGRESS {
        id int PK
        user_id int FK
        step_id int FK
        completed boolean
        completed_at datetime
    }
```

## ASCII-эскиз

```
Roadmap 1---* Step 1---* Resource
                  \
                   \---* Progress *---1 User
```

## Минимальный SQL DDL (пример, PostgreSQL)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin','user'))
);

CREATE TABLE roadmaps (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE steps (
    id UUID PRIMARY KEY,
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL
);

CREATE TABLE resources (
    id UUID PRIMARY KEY,
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('article','video','course'))
);

CREATE TABLE progress (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, step_id)
);
```

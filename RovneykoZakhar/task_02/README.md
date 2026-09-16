# Full-Stack Application - Local Run Guide

This project contains a Vite frontend and a Python backend.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is usually available at `http://localhost:5173`; the exact URL and port are printed by Vite.

## Backend

Python 3.11 is required.

```bash
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

If PowerShell blocks script activation, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once and activate the environment again.

Keep the backend and frontend running in separate terminals while developing.

# Mini-Courses Platform (Variant 30)

A compact learning platform built with Python, Flask, and SQLite. The project demonstrates the design of a practical MVP for managing short courses, lessons, learning progress, tests, comments, and user accounts.

## Implemented scope

- course and lesson management;
- video lesson links and progress tracking;
- test model foundation;
- comments and user registration/login;
- SQLite persistence with demo data seeding.

## Requirements

- Python 3.11+
- packages listed in `requirements.txt`

## Local setup

```bash
python -m venv .venv
.\\.venv\\Scripts\\activate
pip install -r requirements.txt
```

Set the Flask application and initialize the database:

```bash
set FLASK_APP=run.py
python db_init.py
flask run
```

On Windows PowerShell, use `$env:FLASK_APP = "run.py"` instead of `set FLASK_APP=run.py`.

## Tests

```bash
pytest
```

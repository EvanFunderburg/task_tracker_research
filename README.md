# Task Tracker Research App

A full-stack task tracker built with React, FastAPI, and SQLite.

## Features

- Create tasks with a title, priority, and optional due date
- View saved tasks
- Mark tasks complete or incomplete
- Delete tasks
- Tasks remain saved after refreshing the browser

## Technology Used

- Frontend: React, TypeScript, and Vite
- Backend: Python and FastAPI
- Database: SQLite using SQLModel

## Run Locally

### Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
fastapi dev main.py
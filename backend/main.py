from contextlib import asynccontextmanager
from datetime import date
from typing import Optional

from fastapi import FastAPI, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select


# SQLite database for now. We can switch this to PostgreSQL later.
sqlite_file_name = "task_tracker.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(
    sqlite_url,
    connect_args={"check_same_thread": False}
)


class TaskBase(SQLModel):
    title: str
    priority: str = "Medium"
    due_date: Optional[date] = None
    completed: bool = False


# This is the database table.
class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


# This is the data FastAPI accepts when creating a task.
class TaskCreate(TaskBase):
    pass


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"message": "Task Tracker API is running!"}


@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate):
    db_task = Task.model_validate(task)

    with Session(engine) as session:
        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        return db_task


@app.get("/tasks", response_model=list[Task])
def get_tasks():
    with Session(engine) as session:
        tasks = session.exec(select(Task)).all()
        return tasks
    
    
    
@app.patch("/tasks/{task_id}/complete", response_model=Task)
def toggle_task_complete(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        task.completed = not task.completed
        session.add(task)
        session.commit()
        session.refresh(task)

        return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        session.delete(task)
        session.commit()

        return {"message": "Task deleted"}
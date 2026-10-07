import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

type Priority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  due_date: string | null;
  completed: boolean;
};

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`${API_URL}/tasks`);

        if (!response.ok) {
          throw new Error("Could not load tasks.");
        }

        const savedTasks = await response.json();
        setTasks(savedTasks);
      } catch {
        setError("Could not connect to the FastAPI server.");
      }
    }

    loadTasks();
  }, []);

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          priority,
          due_date: dueDate || null,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create task.");
      }

      const savedTask = await response.json();
      setTasks([...tasks, savedTask]);

      setTitle("");
      setPriority("Medium");
      setDueDate("");
      setError("");
    } catch {
      setError("Could not save the task.");
    }
  }

  async function toggleTask(taskId: number) {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${taskId}/complete`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        throw new Error("Could not update task.");
      }

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch {
      setError("Could not update the task.");
    }
  }

  async function deleteTask(taskId: number) {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete task.");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch {
      setError("Could not delete the task.");
    }
  }

  return (
    <main className="app">
      <h1>Task Tracker</h1>
      <p className="subtitle">Keep track of what you need to get done.</p>

      <form className="task-form" onSubmit={addTask}>
        <label>
          Task title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g., Study for exam"
          />
        </label>

        <label>
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>

        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <section>
        <h2>Your Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? "completed" : ""}>
                <div>
                  <strong>{task.title}</strong>
                  <p>
                    {task.priority} priority
                    {task.due_date && ` • Due ${task.due_date}`}
                  </p>
                </div>

                <div className="actions">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? "Mark Incomplete" : "Complete"}
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
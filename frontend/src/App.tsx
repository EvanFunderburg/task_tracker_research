import { useState, type FormEvent } from "react";
import "./App.css";

type Priority = "Low" | "Medium" | "High";

type Task = {
  id: number;
  title: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
};

const startingTasks: Task[] = [
  {
    id: 1,
    title: "Finish research milestone",
    priority: "High",
    dueDate: "2026-10-11",
    completed: false,
  },
  {
    id: 2,
    title: "Test FastAPI endpoints",
    priority: "Medium",
    dueDate: "",
    completed: true,
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(startingTasks);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      priority,
      dueDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setPriority("Medium");
    setDueDate("");
  }

  function toggleTask(taskId: number) {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(taskId: number) {
    setTasks(tasks.filter((task) => task.id !== taskId));
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
                    {task.dueDate && ` • Due ${task.dueDate}`}
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
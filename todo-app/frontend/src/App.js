import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Could not connect to server.");
      setTasks([]);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      setTitle("");
      fetchTasks();
    } catch (e) {
      console.error("Add error:", e);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const toggleTask = async (task) => {
    try {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      fetchTasks();
    } catch (e) {
      console.error("Toggle error:", e);
    }
  };

  const editTask = async (task) => {
    const newTitle = window.prompt("Edit task title", task.title);
    if (!newTitle || !newTitle.trim() || newTitle.trim() === task.title) return;
    try {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() })
      });
      fetchTasks();
    } catch (e) {
      console.error("Edit error:", e);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const doneCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - doneCount;

  return (
    <div className="main-bg">
      <nav className="navbar">
        <div className="navbar-title">My To-Do List</div>
      </nav>
      <div className="container">
        <div className="header">
          <h1>My To-Do List</h1>
          <p>Stay organized. Get things done.</p>
        </div>

        {error && (
          <div style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">TOTAL</div>
          </div>
          <div className="stat-card done">
            <div className="stat-number">{doneCount}</div>
            <div className="stat-label">DONE</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">PENDING</div>
          </div>
        </div>

        <div className="card add-task-card">
          <h2>Add New Task</h2>
          <form onSubmit={addTask} className="add-task-form">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
            <button type="submit" className="add-btn">+ Add Task</button>
          </form>
        </div>

        <div className="card tasks-list-card">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span role="img" aria-label="clipboard" className="empty-icon">📋</span>
              <p>No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            <ul className="tasks-list">
              {tasks.map(t => (
                <li key={t.id} className={t.completed ? "task done" : "task"}>
                  <div className="task-main">
                    <div className="task-title">{t.title}</div>
                  </div>
                  <div className="task-actions">
                    <button className="delete-btn" onClick={() => toggleTask(t)}>
                      {t.completed ? "Mark Pending" : "Mark Done"}
                    </button>
                    <button className="delete-btn" onClick={() => editTask(t)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteTask(t.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
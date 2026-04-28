import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setTasks([]);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  useEffect(() => { fetchTasks(); }, []);

  const doneCount = tasks.filter(t => t.done).length;
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
            <label>Description <span className="optional">(optional)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details..."
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
                <li key={t.id} className={t.done ? "task done" : "task"}>
                  <div className="task-main">
                    <div className="task-title">{t.title}</div>
                    {t.description && <div className="task-desc">{t.description}</div>}
                  </div>
                  <button className="delete-btn" onClick={() => deleteTask(t.id)}>Delete</button>
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
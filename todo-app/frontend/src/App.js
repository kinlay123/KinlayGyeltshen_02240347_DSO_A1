import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const API = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({title: task})
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, {method:"DELETE"});
    fetchTasks();
  };

  useEffect(()=>{fetchTasks()},[]);

  return (
    <div>
      <h1>Todo App</h1>

      <input value={task} onChange={e=>setTask(e.target.value)} />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(t=>(
          <li key={t.id}>
            {t.title}
            <button onClick={()=>deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
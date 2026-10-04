'use client';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (action) => {
    setError('');
    if (!username || !password) {
      setError('กรุณากรอก Username และ Password');
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        loadTasks(data.userId);
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  const loadTasks = async (userId) => {
    const res = await fetch(`/api/tasks?userId=${userId}`);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, title: newTask }),
    });
    if (res.ok) {
      setNewTask('');
      loadTasks(user.userId);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    loadTasks(user.userId);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>To-Do App Login</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px', boxSizing: 'border-box' }}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px', boxSizing: 'border-box' }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
            <button type="button" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleAuth('login')}>
              Login
            </button>
            <button type="button" style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleAuth('register')}>
              Register
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={() => setUser(null)} style={{ marginBottom: '20px', cursor: 'pointer' }}>Logout</button>
      <div>
        <input style={{ width: '70%', padding: '8px', marginRight: '10px' }} placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <button style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={addTask}>Add</button>
      </div>
      <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
        {tasks.map((t) => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', background: '#f4f4f4', padding: '8px' }}>
            <span>{t.title}</span>
            <button onClick={() => deleteTask(t.id)} style={{ cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
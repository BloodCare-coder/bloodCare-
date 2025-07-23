import React, { useState } from 'react';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        username, password
      });
      localStorage.setItem('adminToken', res.data.token);
      alert('Login successful');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="p-2 border m-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="p-2 border m-2" />
      <button onClick={handleLogin} className="bg-red-500 text-white px-4 py-2 rounded">Login</button>
    </div>
  );
}



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../App.css'; // Ensure this path is correct for your project structure

const RegisterPage = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role to 'employee'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(username, password, role);
      localStorage.setItem('token', response.token);
      setAuth(true);
      navigate('/');
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <div className='flex flex-col items-center p-8 h-screen bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white'>
    <form onSubmit={handleSubmit} className="auth-form bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl text-white mb-4">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 mb-4 w-full bg-transparent border-b border-white placeholder-white text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 mb-4 w-full bg-transparent border-b border-white placeholder-white text-white"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-2 mb-4 w-full bg-transparent border-b border-white text-white"
      >
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="p-2 w-full bg-blue-500 text-white rounded-lg">
        Register
      </button>
    </form>
    </div>
  );
};

export default RegisterPage;

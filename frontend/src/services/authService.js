import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth/';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}auth/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const register = async (username, password, role) => {
    const response = await axios.post(`${API_URL}auth/register`, { username, password, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  };

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};

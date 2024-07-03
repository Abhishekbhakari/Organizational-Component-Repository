import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth/';

const getAuthToken = () => localStorage.getItem('token');

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': getAuthToken(),
  },
});

export const addComponent = async (componentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('/components', componentData, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding component:', error);
    throw error;
  }
};

export const getComponents = async (search) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/components?search=${search}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching components:', error);
    throw error;
  }
};

export const modifyComponent = async (id, componentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`/components/${id}`, componentData, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error modifying component:', error);
    throw error;
  }
};

export const getComponentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/components/${id}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching component by ID:', error);
    throw error;
  }
};

import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth/';
// Single function to get the token
const getToken = () => localStorage.getItem('token');
// Axios instance with headers for authorization
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`, // Use the single getToken() function
  },
});
export const addComponent = async (componentData) => {
  try {
    // Always use getToken() to fetch the token
    const token = getToken();
    if (!token) {
      // Handle case where no token is present, 
      // potentially redirect to login
      console.error("No authentication token found. User may need to log in.");
      return;
    }
    const response = await instance.post('/components', componentData);
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

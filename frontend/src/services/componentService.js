import axios from 'axios'; // Correct import statement

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const instance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  },
});

export const addComponent = async (componentData) => {
  try {
    const token = getToken();
    if (!token) {
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

export const getComponents = async (searchTerm, technologies, tags, rating) => {
  try {
    let query = '';
    if (searchTerm) {
      query += `?name=${searchTerm}`;
    }
    if (technologies && technologies.length > 0) { 
      query += `${query ? '&' : '?'}technologies=${technologies.join(',')}`;
    }
    if (tags && tags.length > 0) { 
      query += `${query ? '&' : '?'}tags=${tags.join(',')}`;
    }
    // Only add the rating filter if it's not null
    if (rating !== null) { 
      query += `${query ? '&' : '?'}rating=${rating}`;
    }
    const response = await instance.get(`${API_URL}${query}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};


export const getComponentsDashboard = async () => {
  try {
    const response = await instance.get(`/components`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching components:', error);
    return [];
  }
};

export const modifyComponent = async (id, componentData) => {
  try {
    const token = getToken();
    const response = await instance.put(`/components/${id}`, componentData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error modifying component:', error);
    throw error;
  }
};

export const deleteComponent = async (id) => {
  try {
    const token = getToken();
    const response = await instance.delete(`/components/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting component:', error);
    throw error;
  }
};

export const getComponentById = async (id) => {
  try {
    const token = getToken();
    const response = await instance.get(`/components/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching component by ID:', error);
    throw error;
  }
};

export const updateComponent = async (id, updatedComponent) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedComponent);
    return response.data;
  } catch (error) {
    throw error;
  }
};
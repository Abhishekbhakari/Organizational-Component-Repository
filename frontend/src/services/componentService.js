import axios from 'axios'; 

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
    let config = {}; // Create an object to hold the configuration for the request
    if (searchTerm) {
      config.params = { name: searchTerm }; // Add the search term to  params
    }
    if (technologies && technologies.length > 0) {
      config.params = { ...config.params, technologies: technologies.join(',') }; // Add technologies to params
    }
    if (tags && tags.length > 0) {
      config.params = { ...config.params, tags: tags.join(',') }; // Add tags params
    }
    if (rating !== null) {
      config.params = { ...config.params, rating: rating }; // Add rating to params
    }
    const response = await instance.get('/components', config); // Use the instance object
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

export const updateComponent = async (componentId, updatedData) => {
  try {
    const response = await instance.put(`/components/${componentId}`, updatedData);
    return response.data; // Returns the updated component data
  } catch (error) {
    throw error;
  }
};

export const addComment = async (componentId, commentText) => {
  try {
    const response = await instance.put(`/components/${componentId}/comments`, { text: commentText });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const featchComments = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/components/${componentId}/comments`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Comments:', error);
//     throw error;
//   }
  
// }
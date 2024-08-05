import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAllUsers = async () => {
    try {
        console.log('Making API request to:', `${API_URL}admin/users`);
        const response = await axios.get(`${API_URL}admin/users`);
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

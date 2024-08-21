import axios from 'axios';
import { getCurrentUser } from '../services/authService';
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

export const deleteUser = async (userId) => {
    try {
        console.log('deleteUser called with userId:', userId); 
        const token = getCurrentUser(); // Ensure this returns just the token string
        const response = await axios.delete(`${API_URL}admin/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return true; // Deletion successful
        } else {
            console.error('Error deleting user:', response.status);
            throw new Error('Error deleting user.'); 
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
import { toast } from 'react-hot-toast';
import '../App.css'; 

export const addNotification = (message, type) => {
  toast(message, {
    duration: 3000,
    icon: type === 'success' ? '✔️' : type === 'error' ? '❌' : 'ℹ️', // Icons based on type
    style: {
      backgroundColor: type === 'success' ? '#ffffff' : type === 'error' ? '#FFBABA' : '#BDE5F8', // Background colors
      color: type === 'success' ? '#4F8A10' : type === 'error' ? '#D8000C' : '#00529B', // Text colors
    },
  });
};

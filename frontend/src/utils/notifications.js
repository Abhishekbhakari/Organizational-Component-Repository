import { toast } from 'react-hot-toast';
import '../App.css'; 

export const addNotification = (message, type) => {
  toast(message, {
    duration: 3000, // Adjust the duration as needed
    iconTheme: {
      primary: type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue', // Customize colors
    },
  });
};
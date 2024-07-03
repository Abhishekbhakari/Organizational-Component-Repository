import React, { useState, useEffect } from 'react';
import { addComponent } from '../services/componentService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [componentData, setComponentData] = useState({
    name: '',
    use: '',
    technologies: '',
    tags: [],
  });
  const [userRole, setUserRole] = useState(null); // To store the user's role
  const navigate = useNavigate();
useEffect(() => {
  const fetchUserRole = async () => {
    try {
      // ... (token retrieval)

      const response = await axios.get('/api/auth/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response:', response.data); // Log the response
      setUserRole(response.data.role); // Access the role from the response
    } catch (error) {
      // ...
    }
  };
  fetchUserRole();
}, [navigate]);
  const handleModifyComponent = (e) => {
    setComponentData({ ...componentData, [e.target.name]: e.target.value });
  };
  const handleAddComponent = async (e) => {
    e.preventDefault();
    try {
      await addComponent(componentData);
      // Handle success, maybe clear the form, etc.
      console.log('Component added successfully!');
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };
  // Redirect if the user is not an admin
  if (userRole !== 'admin') {
    return (
      <div>
        <h1>You do not have permission to access this page.</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <form className="mb-4" onSubmit={handleAddComponent}>
        <input
          type="text"
          placeholder="Name"
          className="p-2 border border-gray-300 rounded mr-2"
          value={newComponent.name}
          onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Use"
          className="p-2 border border-gray-300 rounded mr-2"
          value={newComponent.use}
          onChange={(e) => setNewComponent({ ...newComponent, use: e.target.value })}
        />
        <input
          type="text"
          placeholder="Technologies"
          className="p-2 border border-gray-300 rounded mr-2"
          value={newComponent.technologies}
          onChange={(e) => setNewComponent({ ...newComponent, technologies: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags"
          className="p-2 border border-gray-300 rounded mr-2"
          value={newComponent.tags}
          onChange={(e) => setNewComponent({ ...newComponent, tags: e.target.value })}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded"
          type="submit"
        >
          Add Component
        </button>
      </form>
      <div>
        {components.map((component) => (
          <div key={component._id} className="mb-4 p-4 border border-gray-300 rounded">
            <input
              type="text"
              className="p-2 border border-gray-300 rounded mr-2"
              value={component.name}
              onChange={(e) => handleModifyComponent(component._id, { ...component, name: e.target.value })}
            />
            <input
              type="text"
              className="p-2 border border-gray-300 rounded mr-2"
              value={component.use}
              onChange={(e) => handleModifyComponent(component._id, { ...component, use: e.target.value })}
            />
            <input
              type="text"
              className="p-2 border border-gray-300 rounded mr-2"
              value={component.technologies}
              onChange={(e) => handleModifyComponent(component._id, { ...component, technologies: e.target.value })}
            />
            <input
              type="text"
              className="p-2 border border-gray-300 rounded mr-2"
              value={component.tags.join(', ')}
              onChange={(e) => handleModifyComponent(component._id, { ...component, tags: e.target.value.split(',') })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

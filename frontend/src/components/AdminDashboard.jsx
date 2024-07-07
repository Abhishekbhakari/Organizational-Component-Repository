import React, { useState, useEffect } from 'react';
import { addComponent, getComponentsDashboard, modifyComponent, deleteComponent } from '../services/componentService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from '../services/authService';
import '../App.css';

const AdminDashboard = () => {
  const [componentData, setComponentData] = useState({
    name: '',
    use: '',
    technologies: '',
    tags: [],
  });
  const [components, setComponents] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = getCurrentUser();
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/login');
      }
    };
    fetchUserRole();
    fetchComponents();
  }, [navigate]);

  const fetchComponents = async () => {
    try {
      const fetchedComponents = await getComponentsDashboard();
      setComponents(fetchedComponents);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleModifyComponent = async (componentId, updatedComponent) => {
    try {
      await modifyComponent(componentId, updatedComponent);
      fetchComponents();
    } catch (error) {
      console.error('Error modifying component:', error);
    }
  };

  const handleDeleteComponent = async (id) => {
    try {
      await deleteComponent(id);
      setComponents(components.filter((component) => component._id !== id));
      console.log('Component deleted successfully!');
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  const handleAddComponent = async (e) => {
    e.preventDefault();
    try {
      await addComponent(componentData);
      fetchComponents();
      console.log('Component added successfully!');
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  if (userRole && userRole !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center h-screen bg-gradient-to-r  from-gray-950 via-purple-950 to-gray-900 text-white">
        <h1 className="text-2xl font-bold">You do not have permission to access this page.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center p-8  bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
      <h1 className="text-2xl md:text-4xl mb-8 font-bold">Admin Dashboard</h1>
      <form className="mb-4 w-full max-w-lg glass-form" onSubmit={handleAddComponent}>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-2 glass-input"
          name="name"
          value={componentData.name}
          onChange={(e) => setComponentData({ ...componentData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Use"
          className="w-full p-2 mb-2 glass-input"
          name="use"
          value={componentData.use}
          onChange={(e) => setComponentData({ ...componentData, use: e.target.value })}
        />
        <input
          type="text"
          placeholder="Technologies"
          className="w-full p-2 mb-2 glass-input"
          name="technologies"
          value={componentData.technologies}
          onChange={(e) => setComponentData({ ...componentData, technologies: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags"
          className="w-full p-2 mb-2 glass-input"
          name="tags"
          value={componentData.tags.join(', ')}
          onChange={(e) =>
            setComponentData({ ...componentData, tags: e.target.value.split(',') })
          }
        />
        <button className="w-full p-2 text-white rounded-lg glass-button" type="submit">
          Add Component
        </button>
      </form>

      <div className="w-full max-w-lg">
        {components.map((component) => (
          <div key={component._id} className="mb-4 p-4 glass-card">
            <input
              type="text"
              className="w-full p-2 mb-2 glass-input"
              value={component.name}
              onChange={(e) => handleModifyComponent(component._id, { ...component, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 mb-2 glass-input"
              value={component.use}
              onChange={(e) => handleModifyComponent(component._id, { ...component, use: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 mb-2 glass-input"
              value={component.technologies}
              onChange={(e) => handleModifyComponent(component._id, { ...component, technologies: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 glass-input"
              value={component.tags.join(', ')}
              onChange={(e) =>
                handleModifyComponent(component._id, { ...component, tags: e.target.value.split(',') })
              }
            />
            <button
              className="w-full p-2 mt-2 text-white rounded-lg glass-button"
              onClick={() => handleModifyComponent(component._id, component)}
            >
              Save Changes
            </button>
            <button
              className="w-full p-2 mt-2 text-white rounded-lg glass-button bg-red-500"
              onClick={() => handleDeleteComponent(component._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

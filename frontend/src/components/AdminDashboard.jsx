import React, { useState, useEffect } from 'react';
import { addComponent, getComponentsDashboard, modifyComponent, deleteComponent } from '../services/componentService';
// import { getAllUsers } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from '../services/authService';
import { addNotification } from '../utils/notifications'; 
import '../App.css';

const AdminDashboard = () => {
  const [componentData, setComponentData] = useState({
    name: '',
    use: '',
    technologies: '',
    tags: [],
    codeSnippets: [],
  });
  const [components, setComponents] = useState([]);
  const [users, setUsers] = useState([]);
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
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/login');
      }
    };
    fetchUserRole();
    fetchComponents();
    fetchUsers();
  }, [navigate]);

  const fetchComponents = async () => {
    try {
      const fetchedComponents = await getComponentsDashboard();
      setComponents(fetchedComponents);

    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleModifyComponent = async (componentId, updatedComponent) => {
    try {
      await modifyComponent(componentId, updatedComponent);
      fetchComponents();
      addNotification('Component modified successfully!', 'success');
    } catch (error) {
      console.error('Error modifying component:', error);
      addNotification('Error modifying component.', 'error');
    }
  };

  const handleDeleteComponent = async (id) => {
    try {
      await deleteComponent(id); // Call the deleteComponent function
      setComponents(components.filter((component) => component._id !== id)); // Update the state
      addNotification('Component deleted successfully!', 'success'); // Add notification
    } catch (error) {
      console.error('Error deleting component:', error);
      addNotification('Error deleting component.', 'error'); // Add notification
    }
  };

  const handleAddComponent = async (e) => {
    e.preventDefault();
    try {
      await addComponent(componentData);
      fetchComponents();
      console.log('Component added successfully!');
      addNotification('Component added successfully!', 'success'); 
    } catch (error) {
      console.error('Error adding component:', error);
      addNotification('Error adding component.', 'error');
    }
  };

  const handleSnippetChange = (index, field, value) => {
    const newSnippets = [...componentData.codeSnippets];
    newSnippets[index] = { ...newSnippets[index], [field]: value };
    setComponentData({ ...componentData, codeSnippets: newSnippets });
  };

  const addSnippetField = () => {
    setComponentData({
      ...componentData,
      codeSnippets: [...componentData.codeSnippets, { language: '', code: '' }],
    });
  };

  if (userRole && userRole !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center h-screen bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
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
        {componentData.codeSnippets.map((snippet, index) => (
          <div key={index}>
            <input
              type="text"
              value={snippet.language}
              onChange={(e) => handleSnippetChange(index, 'language', e.target.value)}
              placeholder="Language"
              className="w-full p-2 mb-2 glass-input"
            />
            <textarea
              value={snippet.code}
              onChange={(e) => handleSnippetChange(index, 'code', e.target.value)}
              placeholder="Code"
              className="w-full p-2 mb-2 glass-input"
            ></textarea>
          </div>
        ))}
        <button type="button" onClick={addSnippetField} className="w-full p-2 mb-2 glass-button">
          Add Snippet Field
        </button>
        <button className="w-full p-2 text-white rounded-lg glass-button" type="submit">
          Add Component
        </button>
      </form>

      <div className="w-full max-w-lg mb-8">
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

      <div className="w-full max-w-lg">
        <h2 className="text-2xl mb-4 font-bold">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="mb-2 glass-card p-2">
              {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

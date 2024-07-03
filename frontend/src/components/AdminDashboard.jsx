import React, { useState, useEffect } from 'react';
import { getComponents, addComponent, modifyComponent } from '../services/componentService';

const AdminDashboard = () => {
  const [components, setComponents] = useState([]);
  const [newComponent, setNewComponent] = useState({ name: '', use: '', technologies: '', tags: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getComponents('');
        setComponents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching components:', error);
        setComponents([]);
      }
    };
    fetchData();
  }, []);

  const handleAddComponent = async (e) => {
    e.preventDefault();
    try {
      const data = await addComponent(newComponent);
      setComponents([...components, data]);
      setNewComponent({ name: '', use: '', technologies: '', tags: '' });
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const handleModifyComponent = async (id, updatedComponent) => {
    try {
      const data = await modifyComponent(id, updatedComponent);
      setComponents(components.map(comp => (comp._id === id ? data : comp)));
    } catch (error) {
      console.error('Error modifying component:', error);
    }
  };

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

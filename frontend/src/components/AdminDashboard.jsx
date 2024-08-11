import React, { useState, useEffect } from 'react';
import { addComponent, getComponentsDashboard, modifyComponent, deleteComponent } from '../services/componentService';
import { getAllUsers } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from '../services/authService';
import { addNotification } from '../utils/notifications'; 
import '../App.css';
import { Chart as ChartJS, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Dropzone from 'react-dropzone'; 


ChartJS.register(ArcElement, CategoryScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LinearScale);


const AdminDashboard = () => {
  const [componentData, setComponentData] = useState({
    name: '',
    use: '',
    technologies: '',
    tags: [],
    codeSnippets: [],
    image:null,
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [components, setComponents] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  
  const [pieChartData, setPieChartData] = useState({
    labels: ['Users', 'Components'],
    datasets: [
      {
        label: 'Count',
        data: [users.length, components.length],
        backgroundColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [barChartData, setBarChartData] = useState({
    labels: ['Users', 'Components'],
    datasets: [
      {
        label: 'Count',
        data: [users.length, components.length],
        backgroundColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });


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
    const fetchData = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        const fetchedComponents = await getComponentsDashboard();
        // Update state of chart data..
        setPieChartData({
          ...pieChartData,
          datasets: [
            {
              ...pieChartData.datasets[0],
              data: [fetchedUsers.length, fetchedComponents.length], // Update 
            },
          ],
        });
        setBarChartData({
          ...barChartData,
          datasets: [
            {
              ...barChartData.datasets[0],
              data: [fetchedUsers.length, fetchedComponents.length], // Update
            },
          ],
        });
        setUsers(fetchedUsers); 
        setComponents(fetchedComponents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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
      console.log('Fetched Users:', fetchedUsers); 
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
      await deleteComponent(id);
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
      // Create FormData to send the image
      const formData = new FormData();
      formData.append('name', componentData.name);
      formData.append('use', componentData.use);
      formData.append('technologies', componentData.technologies);
      formData.append('tags', JSON.stringify(componentData.tags));
      formData.append('codeSnippets', JSON.stringify(componentData.codeSnippets)); 
      formData.append('image', componentData.image);
      const response = await axios.post('http://localhost:5000/api/components', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getCurrentUser()}`,
        },
      });
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

  const handleImageChange = (e) => {
    setComponentData({ ...componentData, image: e.target.files[0] });
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileSize = file.size / 1024 / 1024; // Size in MB
    if (fileSize > 5) {
      addNotification('File size exceeds 5MB limit', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      addNotification('Please upload an image file', 'error');
      return;
    }
    setComponentData({ ...componentData, image: file });
    setShowImageUpload(false); 
  };
  const handleImageUploadClick = () => {
    setShowImageUpload(true); // Show Dropzone
  };

  if (userRole && userRole !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center h-screen bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
        <h1 className="text-2xl font-bold">You do not have permission to access this page.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center p-8   bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
      <h1 className="text-2xl md:text-4xl mb-8 font-bold">Admin Dashboard</h1>
      <div className="w-screen max-w-lg mb-36">
        <h2 className="text-2xl mb-4 font-bold">Charts</h2>
        <div className="flex flex-col md:flex-row gap-20">
          <div className="w-full md:w-1/2">
            <Pie data={pieChartData} />
            <span data={pieChartData} >{fetchUsers.length}</span>
          </div>
          <div className="w-full md:w-1/2">
            <Bar data={barChartData} />
          </div>
        </div>
      </div>
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
         <button type="button" onClick={handleImageUploadClick} className="w-full p-2 mb-2 glass-button">
          Add Image
        </button>
       {/* //Dropzone */}
        {showImageUpload && ( 
          <Dropzone onDrop={onDrop} className=" w-full p-4 mb-2 glass-card border-2 border-dashed border-gray-500 rounded" multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="text-center text-gray-500">Drag and drop an image here, or click to select one</p>
              </div>
            )}
          </Dropzone>
        )}

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
  <table className="w-full mb-4 glass-card">
    <thead>
      <tr>
        <th className="p-2">Name</th>
        <th className="p-2">Use</th>
        <th className="p-2">Technologies</th>
        <th className="p-2">Tags</th>
        <th className="p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {components.map((component) => (
        <tr key={component._id} className="border-t">
          <td className="p-2">
            <input
              type="text"
              className="w-full p-2 glass-input"
              value={component.name}
              onChange={(e) => handleModifyComponent(component._id, { ...component, name: e.target.value })}
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              className="w-full p-2 glass-input"
              value={component.use}
              onChange={(e) => handleModifyComponent(component._id, { ...component, use: e.target.value })}
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              className="w-full p-2 glass-input"
              value={component.technologies}
              onChange={(e) => handleModifyComponent(component._id, { ...component, technologies: e.target.value })}
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              className="w-full p-2 glass-input"
              value={component.tags.join(', ')}
              onChange={(e) =>
                handleModifyComponent(component._id, { ...component, tags: e.target.value.split(',') })
              }
            />
          </td>
          <td className="p-2">
            <button
              className="w-full p-2 mb-2 text-white rounded-lg glass-button"
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
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      <div className="w-full max-w-lg">
        <h2 className="text-2xl mb-4 font-bold">Users</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Username</th>
              <th className="p-2 border border-gray-300">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="glass-card">
                <td className="p-2 border border-gray-300">{user.username}</td>
                <td className="p-2 border border-gray-300">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

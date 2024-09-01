import React, { useState, useEffect } from 'react';
import { addComponent, getComponentsDashboard, modifyComponent, deleteComponent } from '../services/componentService';
import { getAllUsers, deleteUser } from '../services/adminService';
import { useNavigate } from 'react-router-dom';
import { FaLayerGroup, FaUsers ,FaRegSave} from "react-icons/fa";
import {  BsTrash } from "react-icons/bs";
import axios from 'axios';
import { getCurrentUser } from '../services/authService';
import { addNotification } from '../utils/notifications'; 
import '../App.css';
import { Chart as ChartJS, ArcElement, CategoryScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Dropzone from 'react-dropzone'; 
import toast from 'react-hot-toast';
const API_URL = import.meta.env.VITE_API_URL


ChartJS.register(ArcElement, CategoryScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LinearScale);


const AdminDashboard = () => {
  const [componentData, setComponentData] = useState({
    name: '',
    use: '',
    technologies: '',
    tags: [],
    codeSnippets: [],
    image:null,
    imageName: '',
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [components, setComponents] = useState([]);
  const [editedComponent, setEditedComponent] = useState(null);
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
          toast.error('Please login to access Dashboard', {
            duration: 3000, 
          });
          navigate('/login');
          return;
        }
        const response = await axios.get('https://organizational-component-repository.onrender.com/api/auth', {
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
    //fetch data for charts
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
        toast.success('Data featched Successfully!');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    fetchUserRole();
    fetchComponents();
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (componentData.imageName) {
      setShowDeleteIcon(true); 
    } else {
      setShowDeleteIcon(false);
    }
  }, [componentData.imageName]);

// featch components
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

  // const featchComments = async () => {
  //   try {
  //     await featchComments();

  //   } catch (error) {
      
  //   }
  // }

  const handleDeleteUser = async (userId) => {
    try {
        await deleteUser(userId); 
        setUsers(users.filter(user => user._id !== userId)); 
        addNotification('User deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting user:', error);
        addNotification('Error deleting user.', 'error');
    }
};

const handleModifyComponent = async (componentId) => {
  try {
    console.log("Modifying component:", componentId); 
    const updatedComponent = components.find(c => c._id === componentId);
    console.log("Updated component data:", updatedComponent);

    // Send update request to the backend
    const response = await modifyComponent(componentId, updatedComponent);
 
    console.log("Response from server:", response);

    fetchComponents(); // Re-fetch components

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
      addNotification('Component deleted successfully!', 'success'); 
    } catch (error) {
      console.error('Error deleting component:', error);
      addNotification('Error deleting component.', 'error'); 
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
      const response = await axios.post('https://organizational-component-repository.onrender.com/api/components', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getCurrentUser()}`,
        },
      });
      fetchComponents(); 
      console.log('Component added successfully!');
      addNotification('Component added successfully!', 'success'); 
      setComponentData({
        name: '',
        use: '',
        technologies: '',
        tags: [],
        codeSnippets: [],
        image: null,
      });
      setShowImageUpload(false); 
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
    setComponentData({ ...componentData, image: e.target.files[0],imageName: e.target.files[0].name, });
  };

  const handleDeleteImage = () => {
    setComponentData({
      ...componentData,
      image: null,
      imageName: '',
    });
    setShowDeleteIcon(false);
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
    setComponentData({ ...componentData, image: file, imageName: file.name });
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
      <div className="w-screen max-w-4xl  mb-36">

      {/* Display Charts */}

        <div className=" grid grid-cols-2 gap-5 m-auto mx-10">
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md bg-purple-950 border-violet-400">
            <Pie data={pieChartData} />
          </div>
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md bg-purple-950">
            <Bar data={barChartData} />
          </div>
          <span className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md bg-purple-950 border-violet-400">
            
            Users<span className='text-7xl flex gap-3 font-bold'><FaUsers className="text-sky-600  mr-2" />{users.length}</span> 
          </span>

          <span className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md bg-purple-950 border-violet-400">
            Components <span className='text-7xl flex gap-3 font-bold'><FaLayerGroup className=" text-yellow-500  mr-2" />{components.length}</span>
          </span>
        </div>
      </div>
      {/* Form for Creating Components */}
      <form className="mb-6 w-full max-w-lg glass-form border-violet-500" onSubmit={handleAddComponent}>
        <h1 className=' align-middle font-bold justify-center'>Create Components</h1>
        <label htmlFor="name ">Name</label>
        <input
          type="text"
          placeholder="Enter name of Component"
          className="w-full p-2 mb-2 glass-input"
          name="name"
          required
          value={componentData.name}
          onChange={(e) => setComponentData({ ...componentData, name: e.target.value })}
        />
        <label htmlFor="use">Use</label>
        <input
          type="text"
          placeholder="Enter Uses of Components"
          className="w-full p-2 mb-2 glass-input"
          name="use"
          value={componentData.use}
          onChange={(e) => setComponentData({ ...componentData, use: e.target.value })}
        />
        <label htmlFor="technologies">Technologies</label>
        <input
          type="text"
          placeholder="Enter Technologies Used"
          className="w-full p-2 mb-2 glass-input"
          name="technologies"
          value={componentData.technologies}
          onChange={(e) => setComponentData({ ...componentData, technologies: e.target.value })}
        />
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          placeholder="Mention Tags for Component"
          className="w-full p-2 mb-2 glass-input"
          name="tags"
          value={componentData.tags.join(',')}
          onChange={(e) =>
            setComponentData({ ...componentData, tags: e.target.value.split(',') })
          }
        />
         <button type="button" onClick={handleImageUploadClick} className="w-full p-2 mb-2 glass-button">
          Add Image
        </button>
        {componentData.imageName && ( 
          <p className="text-gray-500 flex justify-center">Selected Image: {componentData.imageName} 
            {showDeleteIcon && ( // Show delete icon 
              <span className="ml-2 cursor-pointer text-red-700 " onClick={handleDeleteImage}>
                <BsTrash /> 
              </span>
            )}
          </p>
        )}
       {/* //Dropzone */}
        {showImageUpload && ( 
          <Dropzone onDrop={onDrop}  multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className=" w-full p-4 mb-2 glass-card border-2 border-dashed border-purple-500 rounded">
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
        <button className="w-full p-2 text-white rounded-lg glass-button border-lime-600" type="submit">
          Create Component
        </button>
      </form>

      {/* CRUD operations on components */}

      <div className="w-full max-w-4xl mb-8">
        <span className='text-2xl md:text-2xl mb-8 font-bold '>Manage Components</span>
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
                  onClick={() => handleModifyComponent(component._id)} onChange={(e) => {
                    const updatedComponent = { ...component, name: e.target.value };
                    setComponents(components.map(c => c._id === component._id ? updatedComponent : c));
                  }}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="w-full p-2 glass-input"
                  value={component.use}
                  onChange={(e) => {
                    const updatedComponent = { ...component, use: e.target.value };
                    setComponents(components.map(c => c._id === component._id ? updatedComponent : c));
                  }}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="w-full p-2 glass-input"
                  value={component.technologies}
                  onChange={(e) => {
                    const updatedComponent = { ...component, technologies: e.target.value };
                    setComponents(components.map(c => c._id === component._id ? updatedComponent : c));
                  }}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="w-full p-2 glass-input"
                  value={component.tags.join(', ')}
                  onChange={(e) => {
                    const updatedComponent = { ...component, tags: e.target.value.split(',') };
                    setComponents(components.map(c => c._id === component._id ? updatedComponent : c));
                  }}
                />
              </td>
              <td className="p-2 flex gap-3 justify-center align-middle">
                <button
                  className="w-full p-2 mb-2 text-white glass-button bg-lime-700 border-lime-500 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
                  onClick={() => handleModifyComponent(component._id)}
                >
                  <FaRegSave />
                </button>
                <button
                  className="w-full p-2 mt-2 text-white glass-button bg-red-500 border-red-800 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
                  onClick={() => handleDeleteComponent(component._id)}
                >
                  <BsTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

{/* // featch Users */}

      <div className="w-full max-w-lg">
        <h2 className="text-2xl mb-4 font-bold">Users</h2>
        <table className="w-full border-collapse border border-indigo-500 rounded-md">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Username</th>
              <th className="p-2 border border-gray-300">Role</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="glass-card">
                <td className="p-2 border border-gray-300">{user.username}</td>
                <td className="p-2 border border-gray-300">{user.role}</td>
                <td className="p-2 border border-gray-300">
                  <button 
                    className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

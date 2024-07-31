import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComponentById } from '../services/componentService';
import { addNotification } from '../utils/notifications';
import '../App.css';

const ComponentDetailsPage = () => {
  const { id } = useParams();
  const [component, setComponent] = useState(null);
  const [snippet, setSnippet] = useState({ language: '', code: '' });
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchComponent = async () => {
      const data = await getComponentById(id);
      setComponent(data);
    };
    fetchComponent();
  }, [id]);

  const handleAddSnippet = async () => {
    try {
      const updatedComponent = await addSnippet(id, snippet);
      setComponent(updatedComponent);
      addNotification('Snippet added successfully!', 'success');
    } catch (error) {
      addNotification('Error adding snippet.', 'error');
    }
  };

  const handleRateComponent = async () => {
    try {
      const updatedComponent = await rateComponent(id, rating);
      setComponent(updatedComponent);
      addNotification('Component rated successfully!', 'success');
    } catch (error) {
      addNotification('Error rating component.', 'error');
    }
  };

  if (!component) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen p-8  bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
      <div className="w-full max-w-lg glass-card">
        <h2 className=' font-extrabold align-middle'>{component.name}</h2>
        <p className="p-2 mb-2 ">`{component.use}`</p>
        <p className="p-2 mb-2 ">`{component.technologies}`</p>
        <div>
          {component.codeSnippets.map((snippet, index) => (
            <div key={index}>
              <h3>{snippet.language}</h3>
              <pre>{snippet.code}</pre>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Language"
            value={snippet.language}
            onChange={(e) => setSnippet({ ...snippet, language: e.target.value })}
            className="w-full p-2 mb-2 glass-input" 
          />
          <textarea
            placeholder="Code"
            value={snippet.code}
            onChange={(e) => setSnippet({ ...snippet, code: e.target.value })}
            className="w-full p-2 mb-2 glass-input" 
          ></textarea>
          <button onClick={handleAddSnippet} className="w-full p-2 bg-blue-500 text-white rounded-lg glass-button">Add Snippet</button>
        </div>
        <div>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 mb-2 glass-input" 
          />
          <button onClick={handleRateComponent} className="w-full p-2 bg-blue-500 text-white rounded-lg glass-button">Rate Component</button>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetailsPage;
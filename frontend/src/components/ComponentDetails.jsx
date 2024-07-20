import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComponentById } from '../services/componentService';

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
    <div className="component-details">
      <h2>{component.name}</h2>
      <p>{component.use}</p>
      <p>{component.technologies}</p>
      <div>
        {component.codeSnippets.map((snippet, index) => (
          <div key={index}>
            <h3>{snippet.language}</h3>
            <pre>{snippet.code}</pre>
          </div>
        ))}
      </div>
      <div>
        <input type="text" placeholder="Language" value={snippet.language} onChange={(e) => setSnippet({ ...snippet, language: e.target.value })} />
        <textarea placeholder="Code" value={snippet.code} onChange={(e) => setSnippet({ ...snippet, code: e.target.value })}></textarea>
        <button onClick={handleAddSnippet}>Add Snippet</button>
      </div>
      <div>
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
        <button onClick={handleRateComponent}>Rate Component</button>
      </div>
    </div>
  );
};

export default ComponentDetailsPage;

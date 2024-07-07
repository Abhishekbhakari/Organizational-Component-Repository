import React, { useState } from 'react';
import { getComponents } from '../services/componentService';
import '../App.css'; 
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await getComponents(searchTerm);
      setComponents(Array.isArray(data) ? data : []);
      setError('');
    } catch (error) {
      setError('Error fetching components');
      setComponents([]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8  bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
      <h2 className="text-2xl md:text-4xl mb-8 font-bold">Search Components</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="glass-form mb-8 w-full max-w-lg">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 mb-4 glass-input"
        />
        <button onClick={handleSearch} className="w-full p-2 bg-blue-500 text-white rounded-lg glass-button">
          Search
        </button>
      </div>
      <table className="w-full max-w-4xl glass-table">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Use</th>
            <th className="p-2">Technologies</th>
            <th className="p-2">Tags</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component._id} className="glass-card">
              <td className="p-2">{component.name}</td>
              <td className="p-2">{component.use}</td>
              <td className="p-2">{component.technologies}</td>
              <td className="p-2">{component.tags.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchPage;

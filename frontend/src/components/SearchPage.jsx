import React, { useState } from 'react';
import { getComponents } from '../services/componentService';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const data = await getComponents(searchTerm);
      setComponents(data);
    } catch (error) {
      setError('Error fetching components');
    }
  };

  return (
    <div>
      <h2>Search Components</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Use</th>
            <th>Technologies</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component._id}>
              <td>{component.name}</td>
              <td>{component.use}</td>
              <td>{component.technologies}</td>
              <td>{component.tags}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchPage;

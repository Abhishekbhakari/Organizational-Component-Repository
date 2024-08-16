import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getComponents } from '../services/componentService';
import '../App.css';
import toast from 'react-hot-toast'; 

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [components, setComponents] = useState([]);
  const [error, setError] = useState('');
  const [technologiesFilter, setTechnologiesFilter] = useState([]); // State for technologies filter
  const [tagsFilter, setTagsFilter] = useState([]); // State for tags filter
  const [ratingFilter, setRatingFilter] = useState(null); // State for rating filter
  const navigate = useNavigate();

  const [uniqueTechnologies, setUniqueTechnologies] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);

  useEffect(() => {
    const fetchUniqueValues = async () => {
      try {
        const data = await getComponents(); // Fetch all components
        setUniqueTechnologies(new Set(data.map(item => item.technologies)));
        setUniqueTags(new Set(data.flatMap(item => item.tags)));
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchUniqueValues(); 
  }, []); // Fetch unique values only once

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to search components', {
        duration: 3000, 
      });
      navigate('/login'); 
      return;
    }
    try {
      // Fetch components with filters
      //  We'll pass 'null' for rating when searching, so the backend can handle it accordingly.
      const data = await getComponents(searchTerm, technologiesFilter, tagsFilter, null); 
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
      <div className="flex gap-4 mb-4">
        <select
          className="w-full p-2 mb-4 glass-input"
          onChange={(e) => setTechnologiesFilter(e.target.value ? [e.target.value] : [])} 
        >
          <option value="">All Technologies</option>
          {uniqueTechnologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>

        <div className="flex flex-col">
          {uniqueTags.map((tag) => (
            <div key={tag} className="flex items-center">
              <input
                type="checkbox"
                id={tag}
                checked={tagsFilter.includes(tag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTagsFilter([...tagsFilter, tag]);
                  } else {
                    setTagsFilter(tagsFilter.filter((t) => t !== tag));
                  }
                }}
              />
              <label htmlFor={tag} className="ml-2">
                {tag}
              </label>
            </div>
          ))}
        </div>

        <input
          type="range"
          min="1"
          max="5"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(parseInt(e.target.value, 10))}
          className="w-full mb-4"
        />
        <label htmlFor="ratingFilter">Minimum Rating:</label>
      </div>
      <table className="w-full max-w-4xl glass-table">
        <thead>
          <tr>
           
            <th className="p-2">Name</th>
            <th className="p-2">Use</th>
            <th className="p-2">Technologies</th>
            <th className="p-2">Tags</th>
            <th className="p-2">Rating</th>
            
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component._id} className="glass-card">
              <td className="p-2 border border-gray-300">
                {/* Add the Link within the existing <td> */}
                <Link to={`/components/${component._id}`} className="hover:underline"> 
                  {component.name} 
                </Link>
              </td>
              {/* <td className="p-2">{component.name}</td> */}
              <td className="p-2">{component.use}</td>
              <td className="p-2">{component.technologies}</td>
              <td className="p-2">{component.tags.join(', ')}</td>
              <td className="p-2">
                {component.ratings.length
                  ? (component.ratings.reduce((r, acc) => acc + r, 0) / component.ratings.length).toFixed(1)
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchPage;
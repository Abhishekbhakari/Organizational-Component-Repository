import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-3 h-screen justify-center items-center bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
      <h2 className=" font-sans font-extrabold text-5xl md:text-7xl mb-8 decoration-purple-200 dr"><span className=' blur-3xl'>....</span> Component <span className=' text-slate-100'>Repository</span> <span className=' blur-3xl'>|||</span>  </h2>
      <div className="flex space-x-4">
        <Link to="/search" className="glass-button shadow-blue-500/50">
          Search Components
        </Link>
        <Link to="/admin" className="glass-button shadow-blue-500/50">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;

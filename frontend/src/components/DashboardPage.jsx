import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/search">Search Components</Link>
      <Link to="/admin">Admin Dashboard</Link>
    </div>
  );
};

export default DashboardPage;

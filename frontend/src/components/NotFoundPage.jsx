import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center h-screen bg-gradient-to-r from-gray-950 via-purple-950 to-gray-900 text-white">
      <h1 className="text-2xl md:text-4xl mb-8 font-bold">404 - Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
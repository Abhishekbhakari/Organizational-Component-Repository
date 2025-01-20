import React, { useState, useEffect, lazy , Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboard from './components/AdminDashboard';
import SearchPage from './components/SearchPage';
import ComponentDetails from './components/ComponentDetails';
import { Toaster } from 'react-hot-toast'; 
import { addNotification } from './utils/notifications';
import NotFoundPage from './components/NotFoundPage';

const App = () => {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuth(true);
  }, []);

  return (
    <Router>
      <Navbar isAuth={isAuth} setAuth={setAuth} />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/register" element={<RegisterPage setAuth={setAuth} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/components/:id" element={<ComponentDetails/>} />
        {/* <Route path="/*" element={<NotFoundPage/>} /> */}

      </Routes>
      <Toaster
       position="top-right" reverseOrder={false} /> 
    </Router>
  );
};

export default App;

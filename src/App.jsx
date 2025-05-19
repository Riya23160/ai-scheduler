import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import Home from './Home';
import CalendarPage from './CalendarPage';
import Settings from './Settings';
import LandingPage from './LandingPage';
import './App.css';

function App() {
  // Load user info from localStorage (null if not logged in)
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  // Load tasks from localStorage or default to empty array
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save userInfo changes to localStorage
  useEffect(() => {
    if (userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo));
    else localStorage.removeItem('userInfo');
  }, [userInfo]);

  // Save tasks changes to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Logout handler with confirmation
  const logout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      setUserInfo(null);
      setTasks([]);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('tasks');
    }
  };

  return (
    <Router>
      <div className="App" style={{ paddingBottom: userInfo ? '60px' : 0 }}>
        <Routes>
          {/* Landing page route */}
          <Route
            path="/"
            element={!userInfo ? <LandingPage setUserInfo={setUserInfo} /> : <Navigate to="/home" />}
          />

          {/* Home page (protected) */}
          <Route
            path="/home"
            element={
              userInfo ? (
                <Home tasks={tasks} setTasks={setTasks} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Calendar page (protected) */}
          <Route
            path="/calendar"
            element={userInfo ? <CalendarPage tasks={tasks} userInfo={userInfo} /> : <Navigate to="/" />}
          />

          {/* Settings page (protected) */}
          <Route
            path="/settings"
            element={
              userInfo ? (
                <Settings userInfo={userInfo} setUserInfo={setUserInfo} logout={logout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>

        {/* Bottom nav only when logged in */}
        {userInfo && (
          <div
            className="bottom-nav"
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '10px 0',
              borderTop: '1px solid #ccc',
              position: 'fixed',
              bottom: 0,
              width: '100%',
              backgroundColor: 'white',
              zIndex: 1000,
            }}
          >
            <Link to="/home" style={{ fontSize: '24px', textDecoration: 'none' }}>
              🏠
            </Link>
            <Link to="/calendar" style={{ fontSize: '24px', textDecoration: 'none' }}>
              📅
            </Link>
            <Link to="/settings" style={{ fontSize: '24px', textDecoration: 'none' }}>
              ⚙️
            </Link>
            {/* No logout button here */}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;

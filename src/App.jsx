// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import CalendarPage from './CalendarPage';
import Settings from './Settings';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : { name: '', email: '' };
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} setTasks={setTasks} />} />
          <Route path="/calendar" element={<CalendarPage tasks={tasks} />} />
          <Route path="/settings" element={<Settings userInfo={userInfo} setUserInfo={setUserInfo} />} />
        </Routes>

        <div className="bottom-nav">
          <Link to="/">🏠</Link>
          <Link to="/calendar">📅</Link>
          <Link to="/settings">⚙️</Link>
        </div>
      </div>
    </Router>
  );
}
export default App

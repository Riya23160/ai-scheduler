import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarPage({ tasks, setTasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newEntry = {
        task: newTask,
        scheduledAt: new Date(selectedDate.setHours(9, 0, 0)),
      };
      setTasks(prev => [...prev, newEntry]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (indexToRemove) => {
    const updated = tasks.filter((_, i) => i !== indexToRemove);
    setTasks(updated);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasTask = tasks.some(t => new Date(t.scheduledAt).toDateString() === date.toDateString());
      return hasTask ? <div style={{ color: '#ff4d4f', fontSize: '1.5em' }}>•</div> : null;
    }
  };

  const tasksForDate = tasks.filter(t => new Date(t.scheduledAt).toDateString() === selectedDate.toDateString());
  const today = new Date().toDateString();

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: 1000,
      margin: 'auto',
      padding: '30px 20px',
      fontFamily: 'Arial, sans-serif',
      gap: '40px',
    }}>
      
      {/* Left: Calendar */}
      <div style={{
        flex: '1 1 350px',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 20 }}>📅 Calendar</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={({ date }) =>
            date.toDateString() === today ? 'react-calendar__tile--now' : null
          }
        />
      </div>

      {/* Right: Tasks Panel */}
      <div style={{
        flex: '1 1 350px',
        backgroundColor: '#f9f9f9',
        padding: '20px 20px 80px',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0',
        position: 'relative',
        minHeight: 400,
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: 10 }}>
          Tasks for <span style={{ color: '#1890ff' }}>{selectedDate.toDateString()}</span>
        </h3>

        {tasksForDate.length === 0 ? (
          <p style={{ color: '#999' }}>No tasks scheduled.</p>
        ) : (
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 10 }}>
            {tasksForDate.map((t, i) => (
              <li key={i} style={{
                marginBottom: 10,
                padding: '8px 12px',
                backgroundColor: '#fff',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <span>
                  📝 <strong>{t.task}</strong><br />
                  <small>{new Date(t.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </span>
                <button
                  onClick={() => handleDeleteTask(i)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#ff4d4f',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                  }}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Sticky Add Task Area */}
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#f9f9f9',
          display: 'flex',
          gap: 10,
        }}>
          <input
            type="text"
            placeholder="Add a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleAddTask}
            style={{
              padding: '10px 16px',
              fontSize: '1rem',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
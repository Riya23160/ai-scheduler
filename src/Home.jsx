import React, { useState } from 'react';

function Home({ tasks, setTasks }) {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');
  const [freeStart, setFreeStart] = useState('');
  const [freeEnd, setFreeEnd] = useState('');
  const [taskDate, setTaskDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const handleAddTask = () => {
    if (!task || !duration || !deadline || !freeStart || !freeEnd || !taskDate) {
      return alert('Please fill all fields');
    }

    const taskDateObj = new Date(taskDate);
    const deadlineDate = new Date(deadline);
    if (deadlineDate < taskDateObj) {
      return alert('Deadline must be on or after the task date.');
    }

    const [sH, sM] = freeStart.split(':').map(Number);
    const [eH, eM] = freeEnd.split(':').map(Number);

    const freeStartDate = new Date(taskDateObj);
    freeStartDate.setHours(sH, sM, 0, 0);
    const freeEndDate = new Date(taskDateObj);
    freeEndDate.setHours(eH, eM, 0, 0);

    const taskDurationMs = parseInt(duration) * 60 * 1000;

    const tasksForDay = tasks
      .filter(t => new Date(t.scheduledAt).toDateString() === taskDateObj.toDateString())
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    let slot = new Date(freeStartDate);
    let scheduled = false;

    for (let i = 0; i <= tasksForDay.length; i++) {
      const nextTaskStart = i < tasksForDay.length ? new Date(tasksForDay[i].scheduledAt) : freeEndDate;

      if (slot.getTime() + taskDurationMs <= nextTaskStart.getTime() && slot.getTime() + taskDurationMs <= deadlineDate.getTime()) {
        setTasks(prev => [...prev, { task, description, duration: parseInt(duration), scheduledAt: new Date(slot), deadline: deadlineDate }]);
        scheduled = true;
        break;
      }
      if (i < tasksForDay.length) {
        slot = new Date(new Date(tasksForDay[i].scheduledAt).getTime() + (tasksForDay[i].duration || 0) * 60 * 1000);
      }
    }

    if (!scheduled) alert('No free slot available before deadline.');

    setTask('');
    setDescription('');
    setDuration('');
    setDeadline('');
    setFreeStart('');
    setFreeEnd('');
  };

  // Delete task handler with confirmation
  const handleDeleteTask = (indexToDelete) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      setTasks(prev => prev.filter((_, index) => index !== indexToDelete));
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#3b82f6' }}>📋 Add Task</h2>

      <input
        placeholder="Task name"
        value={task}
        onChange={e => setTask(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
      <textarea
        placeholder="Description / Notes"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ ...inputStyle, height: 80, resize: 'vertical' }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />

      <input
        placeholder="Duration (min)"
        type="number"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
      <input
        placeholder="Free time start (HH:MM)"
        value={freeStart}
        onChange={e => setFreeStart(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
      <input
        placeholder="Free time end (HH:MM)"
        value={freeEnd}
        onChange={e => setFreeEnd(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />

      <input
        type="date"
        value={taskDate}
        onChange={e => setTaskDate(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />

      <button
        onClick={handleAddTask}
        style={buttonStyle}
        onMouseEnter={e => e.target.style.backgroundColor = '#2563eb'}
        onMouseLeave={e => e.target.style.backgroundColor = '#3b82f6'}
      >
        Auto-Schedule
      </button>

      <h3 style={{ marginTop: 20, color: '#3b82f6' }}>Tasks for {taskDate}</h3>
      <ul style={{ paddingLeft: 0 }}>
        {tasks
          .filter(t => new Date(t.scheduledAt).toDateString() === new Date(taskDate).toDateString())
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
          .map((t, i) => (
            <li key={i} style={taskItemStyle}>
              <div>
                <strong>📝 {t.task}</strong> at {new Date(t.scheduledAt).toLocaleTimeString()}
                {t.description && <p style={{ margin: 0, fontStyle: 'italic', color: '#6b7280' }}>🗒️ {t.description}</p>}
              </div>
              <button
                onClick={() => handleDeleteTask(i)}
                style={deleteButtonStyle}
                title="Delete Task"
                onMouseEnter={e => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={e => e.target.style.backgroundColor = '#ef4444'}
              >
                🗑️
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

const containerStyle = {
  padding: 20,
  maxWidth: 500,
  margin: '0 auto',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#f9fafb',
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: 12,
  padding: 10,
  fontSize: 16,
  borderRadius: 8,
  border: '1px solid #d1d5db',
  transition: 'border-color 0.3s ease',
  outline: 'none',
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: 16,
  background: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  marginTop: 8,
};

const taskItemStyle = {
  listStyle: 'none',
  marginBottom: 12,
  backgroundColor: '#e0f2fe',
  padding: 12,
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)',
};

const deleteButtonStyle = {
  backgroundColor: '#ef4444',
  border: 'none',
  borderRadius: 6,
  color: 'white',
  fontSize: 18,
  cursor: 'pointer',
  padding: '6px 10px',
  transition: 'background-color 0.3s ease',
};

export default Home;

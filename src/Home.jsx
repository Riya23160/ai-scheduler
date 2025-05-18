import React, { useState } from 'react';

function Home({ tasks, setTasks }) {
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');
  const [freeStart, setFreeStart] = useState('');
  const [freeEnd, setFreeEnd] = useState('');

  const handleAddTask = () => {
    if (!task || !duration || !deadline || !freeStart || !freeEnd) return alert("Fill all fields");

    const deadlineDate = new Date(deadline);
    const start = new Date();
    const end = new Date();
    const [sH, sM] = freeStart.split(":").map(Number);
    const [eH, eM] = freeEnd.split(":").map(Number);

    start.setHours(sH, sM, 0, 0);
    end.setHours(eH, eM, 0, 0);

    let scheduled = false;
    const taskMinutes = parseInt(duration) * 60 * 1000;
    let slot = new Date(start);

    while (slot <= end && slot <= deadlineDate) {
      const alreadyScheduled = tasks.some(t => new Date(t.scheduledAt).getTime() === slot.getTime());
      if (!alreadyScheduled) {
        setTasks(prev => [...prev, { task, scheduledAt: new Date(slot), deadline: deadlineDate }]);
        scheduled = true;
        break;
      }
      slot = new Date(slot.getTime() + taskMinutes);
    }

    if (!scheduled) alert("No free slot available before deadline.");

    setTask('');
    setDuration('');
    setDeadline('');
    setFreeStart('');
    setFreeEnd('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Add Task</h2>
      <input placeholder="Task name" value={task} onChange={e => setTask(e.target.value)} style={inputStyle} />
      <input placeholder="Duration (min)" type="number" value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
      <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
      <input placeholder="Free time start (HH:MM)" value={freeStart} onChange={e => setFreeStart(e.target.value)} style={inputStyle} />
      <input placeholder="Free time end (HH:MM)" value={freeEnd} onChange={e => setFreeEnd(e.target.value)} style={inputStyle} />
      <button onClick={handleAddTask} style={buttonStyle}>Auto-Schedule</button>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: 10,
  padding: 8,
  fontSize: 16
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: 16,
  background: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
};

export default Home;

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarPage({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasTask = tasks.some(t => new Date(t.scheduledAt).toDateString() === date.toDateString());
      return hasTask ? <div style={{ color: 'red' }}>•</div> : null;
    }
  };

  const tasksForDate = tasks.filter(t => new Date(t.scheduledAt).toDateString() === selectedDate.toDateString());

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Calendar</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} tileContent={tileContent} />
      <h3 style={{ marginTop: 20 }}>Tasks for {selectedDate.toDateString()}</h3>
      <ul>
        {tasksForDate.map((t, i) => (
          <li key={i}>📝 {t.task} at {new Date(t.scheduledAt).toLocaleTimeString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarPage;
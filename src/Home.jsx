import React, { useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';

function Home({ tasks, setTasks }) {
  const [freeTimeMap, setFreeTimeMap] = useState({});
  const [taskDate, setTaskDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');
  const [freeStart, setFreeStart] = useState('');
  const [freeEnd, setFreeEnd] = useState('');

  useEffect(() => {
    if (freeTimeMap[taskDate]) {
      setFreeStart(freeTimeMap[taskDate].freeStart);
      setFreeEnd(freeTimeMap[taskDate].freeEnd);
    } else {
      setFreeStart('');
      setFreeEnd('');
    }
  }, [taskDate, freeTimeMap]);

  useEffect(() => {
    if (!freeStart || !freeEnd) return;
    setFreeTimeMap(prev => ({
      ...prev,
      [taskDate]: { freeStart, freeEnd }
    }));
  }, [freeStart, freeEnd, taskDate]);

  const timeToDate = (dateStr, timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date(dateStr);
    date.setHours(h, m, 0, 0);
    return date;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getFreeTimeRange = (dateStr, startTime, endTime) => {
    let start = timeToDate(dateStr, startTime);
    let end = timeToDate(dateStr, endTime);
    if (end <= start) {
      end = addDays(end, 1);
    }
    return { start, end };
  };

  const handleAddTask = () => {
    if (!task || !duration || !deadline || !freeStart || !freeEnd || !taskDate) {
      return alert('Please fill all fields');
    }

    const taskDateObj = new Date(taskDate);
    const deadlineDate = new Date(deadline);
    if (deadlineDate < taskDateObj) {
      return alert('Deadline must be on or after the task date.');
    }

    const { start: freeStartDate, end: freeEndDate } = getFreeTimeRange(taskDate, freeStart, freeEnd);
    const taskDurationMs = parseInt(duration) * 60 * 1000;

    const tasksForDay = tasks
      .filter(t => {
        const scheduledDate = new Date(t.scheduledAt);
        return (
          scheduledDate >= freeStartDate &&
          scheduledDate < freeEndDate &&
          !t.finished
        );
      })
      .sort((a, b) => {
        const deadlineDiff = new Date(a.deadline) - new Date(b.deadline);
        if (deadlineDiff !== 0) return deadlineDiff;
        return new Date(a.scheduledAt) - new Date(b.scheduledAt);
      });

    let slot = new Date(freeStartDate);
    let scheduled = false;

    for (let i = 0; i <= tasksForDay.length; i++) {
      const nextTaskStart = i < tasksForDay.length ? new Date(tasksForDay[i].scheduledAt) : freeEndDate;

      if (
        slot.getTime() + taskDurationMs <= nextTaskStart.getTime() &&
        slot.getTime() + taskDurationMs <= deadlineDate.getTime()
      ) {
        // Add the new task with scheduledAt and finished flag
        setTasks(prev => [
          ...prev,
          {
            id: Date.now(), // unique id
            task,
            description,
            duration: parseInt(duration),
            scheduledAt: slot.toISOString(),
            deadline: deadlineDate.toISOString(),
            finished: false
          }
        ]);
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
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleFinishTask = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, finished: !t.finished } : t)
    );
  };

  // Tasks filtered for the selected date and free time range
  const { start: freeStartDateDisplay, end: freeEndDateDisplay } = getFreeTimeRange(taskDate, freeStart, freeEnd);

  const tasksForSelectedDate = tasks
    .filter(t => {
      const scheduledDate = new Date(t.scheduledAt);
      return scheduledDate >= freeStartDateDisplay && scheduledDate < freeEndDateDisplay;
    })
    .sort((a, b) => {
      const deadlineDiff = new Date(a.deadline) - new Date(b.deadline);
      if (deadlineDiff !== 0) return deadlineDiff;
      return new Date(a.scheduledAt) - new Date(b.scheduledAt);
    });

  return (
    <div style={{
      padding: 30,
      fontFamily: 'Arial, sans-serif',
      maxWidth: 900,
      margin: 'auto',
      background: 'linear-gradient(to bottom right, #f0f4f8, #e8ecf1)',
      borderRadius: '12px',
      color: '#333',
    }}>
      <h1 style={{
        fontSize: '36px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'center',
        fontWeight: '700',
        letterSpacing: '1.5px',
      }}>
        <FaRegClock /> Task Scheduler
      </h1>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <label>
          Select Date:{' '}
          <input
            type="date"
            value={taskDate}
            onChange={e => setTaskDate(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 16,
            }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{
          flex: '1 1 350px',
          background: 'linear-gradient(135deg, #d7dbe7, #f7f9fc)',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          minWidth: 300,
        }}>
          <input
            type="text"
            placeholder="Task name"
            value={task}
            onChange={e => setTask(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #bbb',
              marginBottom: 12,
              fontSize: 16,
            }}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #bbb',
              fontSize: 16,
            }}
          />
        </div>

        <div style={{
          flex: '1 1 350px',
          background: 'linear-gradient(135deg, #ececec, #f5f5f5)',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 15,
          fontSize: 16,
          color: '#555',
        }}>
          <label>
            Free Time Start:{' '}
            <input
              type="time"
              value={freeStart}
              onChange={e => setFreeStart(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: '1px solid #bbb',
                fontSize: 16,
                width: '100%',
              }}
            />
          </label>

          <label>
            Free Time End:{' '}
            <input
              type="time"
              value={freeEnd}
              onChange={e => setFreeEnd(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: '1px solid #bbb',
                fontSize: 16,
                width: '100%',
              }}
            />
          </label>

          <label>
            Duration (minutes):{' '}
            <input
              type="number"
              min={1}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: '1px solid #bbb',
                fontSize: 16,
                width: '100%',
              }}
            />
          </label>

          <label>
            Deadline:{' '}
            <input
              type="datetime-local"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
                border: '1px solid #bbb',
                fontSize: 16,
                width: '100%',
              }}
            />
          </label>

          <button
            onClick={handleAddTask}
            style={{
              marginTop: 10,
              padding: '12px 0',
              borderRadius: 8,
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgb(59 130 246 / 0.4)',
              border: 'none',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Add Task
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        padding: 20,
        maxHeight: 400,
        overflowY: 'auto',
      }}>
        <h2 style={{ fontWeight: '600', marginBottom: 20, color: '#1e293b' }}>
          Scheduled Tasks on {taskDate}
        </h2>

        {tasksForSelectedDate.length === 0 && (
          <p style={{ fontStyle: 'italic', color: '#666' }}>
            No tasks scheduled in the free time range.
          </p>
        )}

        {tasksForSelectedDate.map(t => (
          <div key={t.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: t.finished ? '#d1fae5' : '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '12px 15px',
            borderRadius: 10,
            marginBottom: 12,
            boxShadow: t.finished ? '0 0 8px #10b981' : 'none',
            transition: 'background-color 0.3s',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: 17, color: '#334155' }}>{t.task}</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>{t.description}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                Scheduled: {new Date(t.scheduledAt).toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                Duration: {t.duration} min | Deadline: {new Date(t.deadline).toLocaleString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleFinishTask(t.id)}
                style={{
                  backgroundColor: t.finished ? '#22c55e' : '#facc15',
                  color: '#1e293b',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                title={t.finished ? 'Mark as unfinished' : 'Mark as finished'}
              >
                {t.finished ? 'Finished' : 'Finish'}
              </button>
              <button
                onClick={() => handleDeleteTask(t.id)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
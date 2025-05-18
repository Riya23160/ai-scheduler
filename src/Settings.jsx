import React, { useState, useEffect } from 'react';

function Settings({ userInfo, setUserInfo }) {
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify({ name, email }));
    setUserInfo({ name, email });
  }, [name, email, setUserInfo]); // ✅ include setUserInfo

  return (
    <div style={{ padding: 20 }}>
      <h2>⚙️ Settings</h2>
      <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      <input placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
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

export default Settings;

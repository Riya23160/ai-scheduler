import React from 'react';

function Settings({ userInfo, setUserInfo, logout }) {
  if (!userInfo) {
    return <p>Please log in to access settings.</p>;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <div className="settings-page" style={{ padding: '20px' }}>
      <h1 className="settings-title" style={{ marginBottom: '10px' }}>
        Settings
      </h1>

      <h3
        className="settings-greeting"
        style={{
          color: '#2a7ae2', // example primary color, replace with your theme color
          marginBottom: '20px',
        }}
      >
        Hello, {userInfo.name}
      </h3>

      <div
        className="settings-container"
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          width: '300px',
          height: '300px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9', // light background, adjust as per your theme
          marginBottom: '20px',
        }}
      >
        {/* Profile Picture */}
        <img
          src={userInfo.profilePic || '/default-profile.png'}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '10px',
            objectFit: 'cover',
            marginBottom: '20px',
          }}
        />

        {/* User Details */}
        <div
          className="user-details"
          style={{
            textAlign: 'center',
            color: '#333', // text color, adjust as needed
          }}
        >
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Age:</strong> {userInfo.age}</p>
          <p><strong>Date of Birth:</strong> {userInfo.dob}</p>
          {/* Add more details if needed */}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleLogout}
        className="signout-button"
        style={{
          padding: '10px 20px',
          backgroundColor: '#e63946', // red-ish color for logout, adjust as needed
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Settings;

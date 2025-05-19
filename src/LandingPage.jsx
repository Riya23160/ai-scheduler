import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


function LandingPage({ setUserInfo }) {
  const navigate = useNavigate();

  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    age: '',
    dob: '',
    email: '',
  });
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e) => {
    setGuestDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();

    if (!guestDetails.name || !guestDetails.age || !guestDetails.dob) {
      alert('Please fill all guest details.');
      return;
    }

    setUserInfo({
      type: 'guest',
      ...guestDetails,
    });

    navigate('/home');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      setUserInfo({
        type: 'google',
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
      navigate('/home');
    } catch (e) {
      console.error('Failed to decode token', e);
      alert('Google sign-in failed.');
    }
  };

  const handleGoogleError = () => {
    alert('Google Sign-In Failed');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f4f8',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 20,
    }}>
      <img src="/logo192.png" alt="Planner Logo" style={{ width: 120, marginBottom: 20 }} />
      <h1 style={{ marginBottom: 40, color: '#1976d2' }}>Our Planner</h1>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      {!showGuestForm && (
        <button
          onClick={() => setShowWarning(true)}
          style={{
            backgroundColor: '#999',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
            width: 220,
            marginTop: 15,
          }}
        >
          Sign in as Guest
        </button>
      )}

      {showWarning && !showGuestForm && (
        <div style={{
          marginTop: 20,
          maxWidth: 320,
          padding: 15,
          backgroundColor: '#ffe6e6',
          color: '#a33',
          borderRadius: 6,
          textAlign: 'center',
          boxShadow: '0 0 5px rgba(255, 0, 0, 0.3)',
        }}>
          <p>Your data will be lost after you logout or close the app.</p>
          <button
            onClick={() => { setShowGuestForm(true); setShowWarning(false); }}
            style={{
              marginTop: 10,
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Proceed as Guest
          </button>
          <button
            onClick={() => setShowWarning(false)}
            style={{
              marginTop: 10,
              marginLeft: 10,
              backgroundColor: '#ccc',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {showGuestForm && (
        <form onSubmit={handleGuestSubmit} style={{
          marginTop: 30,
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
        }}>
          <input
            name="name"
            value={guestDetails.name}
            onChange={handleChange}
            placeholder="Name"
            required
            style={{
              padding: 10,
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <input
            name="age"
            type="number"
            value={guestDetails.age}
            onChange={handleChange}
            placeholder="Age"
            required
            min={1}
            style={{
              padding: 10,
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <input
            name="dob"
            type="date"
            value={guestDetails.dob}
            onChange={handleChange}
            required
            style={{
              padding: 10,
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <input
            name="email"
            type="email"
            value={guestDetails.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            style={{
              padding: 10,
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <button type="submit" style={{
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 10,
          }}>
            Login as Guest
          </button>
          <button type="button" onClick={() => setShowGuestForm(false)} style={{
            backgroundColor: '#ccc',
            color: '#333',
            padding: '8px',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: 'pointer',
            marginTop: 5,
          }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default LandingPage;

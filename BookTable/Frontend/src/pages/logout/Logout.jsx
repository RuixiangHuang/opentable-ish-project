import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle the logout process
  const handleLogout = async () => {
    const token = localStorage.getItem('satoken');
  
    if (!token) {
      setMessage('No token found. Please log in first.');
      setIsSuccess(false);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Recommended way to send token
        },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify({ satoken: token })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.code === 200) {
        setMessage('Logout successful!');
        setIsSuccess(true);
        localStorage.removeItem('satoken');
        localStorage.removeItem('role');
  
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(result.msg || 'Logout failed.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setMessage('Something went wrong. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout-container">
      <h2>Logout</h2>
      {loading ? (
        <p>Logging out...</p>
      ) : (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      )}

      {message && (
        <p className={isSuccess ? 'success-msg' : 'error-msg'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Logout;

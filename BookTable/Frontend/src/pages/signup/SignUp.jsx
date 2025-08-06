import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    contactMethod: '',
    email: '',
    phoneNum: '',
    role: 'USER',  // default to USER
    verificationCode: ''  // new field for the verification code
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false); // Track if verification code is sent

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert role to uppercase to match backend enum
    if (name === 'role') {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSendVerification = async () => {
    setError('');
    try {
      const res = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.SEND_VERIFICATION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      if (data.code === 200) {
        setSuccess('Verification code sent to your email.');
        setIsVerificationSent(true);
      } else {
        setError(data.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting payload:", JSON.stringify(form, null, 2));
    setError('');
    try {
      const res = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.code === 200) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="contactMethod" placeholder="Contact Method (email/phone)" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phoneNum" placeholder="Phone Number" onChange={handleChange} />

        {/* Add button to trigger verification code sending */}
        <button type="button" onClick={handleSendVerification} disabled={isVerificationSent}>
          Send Verification Code
        </button>

        {/* Add verification code input */}
        {isVerificationSent && (
          <input
            name="verificationCode"
            placeholder="Enter Verification Code"
            onChange={handleChange}
            required
          />
        )}

        <select name="role" onChange={handleChange} value={form.role} required>
          <option value="USER">USER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button type="submit" disabled={!isVerificationSent}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;

import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            console.log(result);

            if (result.code === 200) {
                setMessage('Login successful!');
                setIsSuccess(true);
                localStorage.setItem('satoken', result.data.token);
                localStorage.setItem('role', result.data.role);
                localStorage.setItem('userId', result.data.userId);
                console.log('Role:', result.data.role);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage(result.message || 'Login failed.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Something went wrong!');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && (
                <p className={isSuccess ? 'success-msg' : 'error-msg'}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Login;

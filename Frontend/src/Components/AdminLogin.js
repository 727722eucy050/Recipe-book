import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../images/view-ready-eat-delicious-meal-go.jpg';
import './AdminLogin.css';

function Login() {
  const [formData, setFormData] = useState({
    email_id: '',
    pass: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add the no-scroll class to body when the component mounts
    document.body.classList.add('no-scroll');

    // Remove the no-scroll class from body when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email_id, pass } = formData;
    
    try {
      const response = await axios.get('http://localhost:8080/api/employees');
      const user = response.data.find(user => user.email === email_id);
      
      if (user) {
        if (user.pass === pass && user.role === 'admin') {
          setSuccess('Login successful!');
          navigate('/Validation'); // Redirect to the Validation page on success
        } else {
          setError('Invalid email, password, or role');
          setSuccess(null);
        }
      } else {
        setError('User not found');
        setSuccess(null);
      }
    } catch (error) {
      setError('An error occurred while trying to log in');
      setSuccess(null);
    }
  };

  return (
    <div className="pic2" style={{ backgroundImage: `url(${img})` }}>
    <div className="login-container" style={{ marginTop: '-42px' }}> {/* Adjust this value as needed */}
    <h2 style={{ paddingBottom: '2px', marginTop: '55%', textAlign: 'center', marginLeft: '70px' }}></h2>
    <h2 style={{ paddingBottom: '12px', paddingLeft: '35px',}}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email_id"
              value={formData.email_id}
              onChange={handleChange}
              required
              style={{ height: '40px' }}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              required
              style={{ height: '40px' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '30px' }}>Login</button>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;

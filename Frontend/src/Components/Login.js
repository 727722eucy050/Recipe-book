import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import img from '../images/view-ready-eat-delicious-meal-go.jpg';
import './Login.css';

function Login() {
  const [email_id, setEmail] = useState('');
  const [pass, setPassword] = useState('');
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

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employees');
      const user = response.data.find(user => user.email === email_id);


      if (user) {
        if (user.pass === pass) {
          setSuccess('Login successful!');
          navigate('/Home');
        } else {
          setError('Invalid email or password');
          setSuccess(false);
        }
      } else {
        setSuccess(false);
        setError('User not found');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="pic2" style={{ backgroundImage: `url(${img})` }}>
      <div className="login-container">
        <h2 style={{ paddingBottom: '40px', textAlign: 'center', marginLeft: '70px' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email_id}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ height: '40px' }}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ height: '40px' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '20px'}}>Login</button>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/admin-login" style={{ fontSize: 20, marginLeft: '70px' }}>Admin-Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

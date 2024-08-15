import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import img from '../images/view-ready-eat-delicious-meal-go.jpg';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        pass: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Preload the background image
        const backgroundImg = new Image();
        backgroundImg.src = img;
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};
        if (formData.pass !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    email: formData.email,
                    pass: formData.pass
                })
            });

            if (response.ok) {
                setShowMessage(true);
                setFormData({
                    userName: '',
                    email: '',
                    pass: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/Home');
                }, 3000);
            } else {
                const data = await response.json();
                setErrors({ apiError: data.message });
            }
        } catch (error) {
            setErrors({ apiError: 'An error occurred' });
        }
    };

    const handleLogin = () => {
        navigate('/Login');
    };

    return (
        <div className="pic" style={{ backgroundImage: `url(${img})` }}>
            <div className="signup-container" style={{marginBottom: '92px'}}>
                <div className="signup-form">
                    <h2 style={{marginLeft: '25px'}}>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username" style={{paddingRight: 90}}>Username</label>
                            <input
                                type="text"
                                id="username"
                                name="userName"
                                required
                                value={formData.userName}
                                onChange={handleChange}
                                
                            />
                            {errors.username && <p className="error">{errors.username}</p>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="email" style={{paddingRight: 130}}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="password" style={{paddingRight: 100}}>Password</label>
                            <input
                                type="password"
                                id="password"
                                name="pass"
                                required
                                value={formData.pass}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword" style={{paddingRight: 30}}>Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" style={{ marginLeft: '22px'}}>Sign Up</button>
                        {showMessage && <p className="success">Signup successful!</p>}
                        {errors.apiError && <p className="error">{errors.apiError}</p>}
                    </form>
                    <p style={{marginLeft: '45px'}}>Already Have an Account? <Link to="/Login" onClick={handleLogin}>Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

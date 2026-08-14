import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        
        if (!formData.first_name.trim()) newErrors.first_name = "First name is required.";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required.";
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        }

        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            await api.post('auth/register/', {
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name
            });
            
            setSuccessMessage("Registration successful! Redirecting to login...");
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ non_field_errors: ["An unexpected error occurred. Please try again."] });
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">
                
                {/* Left Branding Panel */}
                <div className="auth-left-panel">
                    <svg className="auth-curve d-none d-lg-block" viewBox="0 0 50 100" preserveAspectRatio="none">
                        <path d="M0,0 C50,30 -20,70 0,100 Z" fill="#4338ca" />
                    </svg>
                    
                    <div className="auth-brand-content">
                        <div className="auth-logo">resume.ai</div>
                        <h1>Analyze. Optimize. Get Hired.</h1>
                        <p className="auth-description">
                            AI-powered resume analysis to help you build a stronger application.
                        </p>
                        <ul className="auth-benefits">
                            <li><span className="check-icon">✓</span> ATS compatibility analysis</li>
                            <li><span className="check-icon">✓</span> Skill & keyword matching</li>
                            <li><span className="check-icon">✓</span> AI-powered recommendations</li>
                        </ul>
                    </div>
                </div>

                {/* Right Registration Panel */}
                <div className="auth-right-panel">
                    <div className="auth-form-container">
                        <h2>Create your account</h2>
                        <p className="auth-subtitle">Start optimizing your resume today.</p>
                        
                        {successMessage && (
                            <div className="alert alert-success py-2 auth-alert" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {errors.non_field_errors && (
                            <div className="alert alert-danger py-2 auth-alert" role="alert">
                                {errors.non_field_errors}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label className="form-label">First Name</label>
                                    <input 
                                        type="text" 
                                        className={`form-control custom-input ${errors.first_name ? 'is-invalid' : ''}`}
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="John"
                                    />
                                    {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label">Last Name</label>
                                    <input 
                                        type="text" 
                                        className={`form-control custom-input ${errors.last_name ? 'is-invalid' : ''}`}
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                    />
                                    {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input 
                                    type="email" 
                                    className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="position-relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle-btn"
                                        onClick={togglePasswordVisibility}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Confirm Password</label>
                                <div className="position-relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control custom-input ${errors.confirm_password ? 'is-invalid' : ''}`}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn custom-btn-primary w-100 mb-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating account...</>
                                ) : 'Create account'}
                            </button>
                            
                            <div className="text-center auth-footer-text">
                                Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Register;

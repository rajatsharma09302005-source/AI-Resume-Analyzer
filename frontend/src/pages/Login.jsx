import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            // Display a clear user-friendly error without exposing internal details
            setError("Invalid email or password. Please try again.");
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
                        <h1>Welcome back</h1>
                        <p className="auth-description">
                            Sign in to continue analyzing and improving your resume.
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="auth-right-panel">
                    <div className="auth-form-container">
                        <h2>Sign in</h2>
                        <p className="auth-subtitle">Access your dashboard and resume analysis.</p>

                        {error && (
                            <div className="alert alert-danger py-2 auth-alert" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input 
                                    type="email" 
                                    className="form-control custom-input"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Password</label>
                                <div className="position-relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        className="form-control custom-input"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle-btn"
                                        onClick={togglePasswordVisibility}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn custom-btn-primary w-100 mb-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...</>
                                ) : 'Sign in'}
                            </button>
                            
                            <div className="text-center auth-footer-text">
                                Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/analyze', label: 'Analyze Resume', icon: '✨' },
        { path: '#', label: 'My Resumes', icon: '📄' },
        { path: '#', label: 'Analysis History', icon: '🕒' },
        { path: '#', label: 'Insights', icon: '💡' },
        { path: '#', label: 'Settings', icon: '⚙️' },
    ];

    const getInitials = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
        } else if (user?.first_name) {
            return user.first_name.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const getFullName = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return user?.first_name || 'User';
    };

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <div className="mobile-brand">resume.ai</div>
                <button 
                    className="mobile-menu-btn" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">resume.ai</div>
                
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {getInitials()}
                    </div>
                    <div className="profile-info">
                        <div className="profile-name">{getFullName()}</div>
                        <div className="profile-email">{user?.email || 'user@example.com'}</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.filter(item => item.label !== 'Settings').map((item, idx) => (
                        <div 
                            key={idx}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => {
                                if (item.path !== '#') {
                                    navigate(item.path);
                                }
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div 
                        className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <span className="nav-icon">⚙️</span>
                        <span className="nav-label">Settings</span>
                    </div>
                    <button className="nav-item logout-nav-btn" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span className="nav-label">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="main-content-scroll">
                    
                    {/* Hero Section */}
                    <header className="hero-section">
                        <div className="hero-content">
                            <h1 className="hero-title">
                                {user?.first_name ? `Welcome, ${user.first_name}` : 'Welcome back'}
                            </h1>
                            <p className="hero-subtitle">
                                Build a stronger resume. Match better with the jobs you want.
                            </p>
                        </div>
                    </header>

                    {/* Primary CTA Area */}
                    <div className="primary-action-area">
                        <div className="action-content">
                            <h2>Resume Analysis</h2>
                            <p>Upload your resume and optionally provide a job description to get an AI-powered analysis.</p>
                            <button className="btn-primary-large" onClick={() => navigate('/analyze')}>
                                Analyze Resume &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="stats-container">
                        <div className="stat-box">
                            <div className="stat-header">
                                <span className="stat-icon">📄</span>
                                <span className="stat-title">Resumes Analyzed</span>
                            </div>
                            <div className="stat-value">0</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-header">
                                <span className="stat-icon">🎯</span>
                                <span className="stat-title">Average Score</span>
                            </div>
                            <div className="stat-value">-</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-header">
                                <span className="stat-icon">💼</span>
                                <span className="stat-title">Job Matches</span>
                            </div>
                            <div className="stat-value">0</div>
                        </div>
                    </div>

                    {/* Recent Resumes */}
                    <section className="content-section">
                        <h2 className="section-heading">Recent Resumes</h2>
                        <div className="empty-state-card">
                            <div className="empty-icon-large">📝</div>
                            <h3>No resumes analyzed yet</h3>
                            <p>Upload your first resume to see your analysis history here.</p>
                            <button className="btn-outline-primary" onClick={() => navigate('/analyze')}>
                                Analyze Your First Resume
                            </button>
                        </div>
                    </section>

                    {/* Why ResumeAI */}
                    <section className="content-section">
                        <h2 className="section-heading">Why ResumeAI?</h2>
                        <div className="feature-cards-grid">
                            <div className="feature-box">
                                <div className="feat-icon">🔍</div>
                                <h4>Resume Analysis</h4>
                                <p>We evaluate your resume structure, tone, and formatting against modern ATS requirements to ensure you pass the initial screen.</p>
                            </div>
                            <div className="feature-box">
                                <div className="feat-icon">✨</div>
                                <h4>Job Matching</h4>
                                <p>Compare your resume directly with a job description to identify missing keywords and tailor your application perfectly.</p>
                            </div>
                            <div className="feature-box">
                                <div className="feat-icon">🧠</div>
                                <h4>AI-Powered Insights</h4>
                                <p>Get precise, actionable suggestions to rewrite bullet points, highlight achievements, and make your experience stand out.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Secondary Panel */}
            <aside className="dashboard-secondary">
                <div className="secondary-card quick-start-card">
                    <h3 className="secondary-heading">Quick Start</h3>
                    <ul className="quick-start-list">
                        <li>
                            <span className="step-num">1</span>
                            <span>Upload Resume</span>
                        </li>
                        <li>
                            <span className="step-num">2</span>
                            <span>Add Job Description</span>
                        </li>
                        <li>
                            <span className="step-num">3</span>
                            <span>Run AI Analysis</span>
                        </li>
                    </ul>
                </div>

                <div className="secondary-card ai-tip-card">
                    <h3 className="secondary-heading">
                        <span className="sparkle">💡</span> AI Tip
                    </h3>
                    <p className="tip-text">
                        Did you know? Quantifying your achievements with numbers increases your chances of getting an interview by over 40%.
                    </p>
                </div>
            </aside>
            
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}
        </div>
    );
};

export default Dashboard;

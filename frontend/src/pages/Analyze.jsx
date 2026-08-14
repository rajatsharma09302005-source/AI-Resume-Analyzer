import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Analyze = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
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

            {/* Main Content Area */}
            <main className="dashboard-main">
                <div className="main-content-scroll">
                    <div className="analyze-temp-container">
                        <h1>Resume Analysis</h1>
                        <p className="analyze-subtitle">Upload and analyze your resume here.</p>
                        
                        <div className="coming-soon-badge">
                            <span>Coming next</span>
                        </div>

                        <button 
                            className="btn-secondary mt-4" 
                            onClick={() => navigate('/dashboard')}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </main>
            
            {/* Empty secondary sidebar just for layout balance, hidden on mobile automatically by css */}
            <aside className="dashboard-secondary" style={{backgroundColor: 'transparent', border: 'none'}}></aside>

            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}
        </div>
    );
};

export default Analyze;

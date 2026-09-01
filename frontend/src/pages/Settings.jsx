import logoLight from '../assets/LOGO.png';
import logoDark from '../assets/LOGO DARK MODE.png';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/dashboard.css';

const Settings = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Profile State
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [profileUpdating, setProfileUpdating] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    // Theme State (Local)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Delete Account State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteDeleting, setDeleteDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/analyze', label: 'Analyze Resume', icon: '✨' },
        { path: '/history', label: 'Analysis History', icon: '🕒' },
        { path: '/insights', label: 'Insights', icon: '💡' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
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

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileUpdating(true);
        setProfileSuccess('');
        setProfileError('');
        try {
            const response = await api.patch('/auth/me/', {
                first_name: firstName,
                last_name: lastName
            });
            updateUser(response.data);
            setProfileSuccess('Profile updated successfully.');
        } catch (error) {
            setProfileError('Failed to update profile. Please try again.');
        } finally {
            setProfileUpdating(false);
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordSuccess('');
        setPasswordError('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        setPasswordUpdating(true);
        try {
            await api.put('/auth/password/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            setPasswordSuccess('Password changed successfully. Please log in again.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            // Force re-login for security
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (error) {
            if (error.response?.data?.old_password) {
                setPasswordError(error.response.data.old_password[0]);
            } else {
                setPasswordError('Failed to change password. Ensure it meets requirements.');
            }
        } finally {
            setPasswordUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteDeleting(true);
        try {
            await api.delete('/auth/me/');
            logout();
            navigate('/login');
        } catch (error) {
            alert('Failed to delete account. Please try again later.');
            setDeleteDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <div className="mobile-brand"><div className="brand-logo-wrapper"><img src={logoLight} alt="AI Resume Analyzer" className="brand-logo" /><img src={logoDark} alt="AI Resume Analyzer" className="brand-logo-dark" /></div></div>
                <button 
                    className="mobile-menu-btn" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-brand"><div className="brand-logo-wrapper"><img src={logoLight} alt="AI Resume Analyzer" className="brand-logo" /><img src={logoDark} alt="AI Resume Analyzer" className="brand-logo-dark" /></div></div>
                
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
                    {navItems.map((item, idx) => (
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
                    <button className="nav-item logout-nav-btn" onClick={handleLogout} style={{ width: '100%' }}>
                        <span className="nav-icon">🚪</span>
                        <span className="nav-label">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main" style={{ marginRight: 0, padding: '2rem' }}>
                <div className="main-content-scroll" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    
                    <div className="mb-5 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Account Settings</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your profile, preferences, and security.</p>
                    </div>

                    {/* Profile Section */}
                    <section className="card shadow-sm mb-5" style={{ borderRadius: '16px', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Profile Information</h3>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium" style={{ color: 'var(--text-secondary)' }}>First Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                            value={firstName} 
                                            onChange={(e) => setFirstName(e.target.value)} 
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium" style={{ color: 'var(--text-secondary)' }}>Last Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                            value={lastName} 
                                            onChange={(e) => setLastName(e.target.value)} 
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)', opacity: 0.7 }}
                                        value={user?.email || ''} 
                                        disabled 
                                        readOnly
                                    />
                                    <div className="form-text mt-2" style={{ color: 'var(--text-secondary)' }}>Email address cannot be changed.</div>
                                </div>
                                
                                {profileSuccess && <div className="alert alert-success py-2">{profileSuccess}</div>}
                                {profileError && <div className="alert alert-danger py-2">{profileError}</div>}
                                
                                <button type="submit" className="btn btn-primary px-4 py-2" disabled={profileUpdating} style={{ backgroundColor: 'var(--brand-indigo)', border: 'none' }}>
                                    {profileUpdating ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section className="card shadow-sm mb-5" style={{ borderRadius: '16px', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Preferences</h3>
                            <div className="mb-3">
                                <label className="form-label fw-medium d-block mb-3" style={{ color: 'var(--text-secondary)' }}>Theme</label>
                                <div className="d-flex gap-3">
                                    <button 
                                        className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => handleThemeChange('light')}
                                        style={theme === 'light' ? { backgroundColor: 'var(--brand-indigo)', border: 'none' } : { borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    >
                                        ☀️ Light
                                    </button>
                                    <button 
                                        className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => handleThemeChange('dark')}
                                        style={theme === 'dark' ? { backgroundColor: 'var(--brand-indigo)', border: 'none' } : { borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    >
                                        🌙 Dark
                                    </button>
                                </div>
                                <div className="form-text mt-2" style={{ color: 'var(--text-secondary)' }}>Choose how the application looks to you.</div>
                            </div>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="card shadow-sm mb-5" style={{ borderRadius: '16px', backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Security</h3>
                            <form onSubmit={handlePasswordUpdate}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                        value={oldPassword} 
                                        onChange={(e) => setOldPassword(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium" style={{ color: 'var(--text-secondary)' }}>New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required
                                    />
                                </div>

                                {passwordSuccess && <div className="alert alert-success py-2">{passwordSuccess}</div>}
                                {passwordError && <div className="alert alert-danger py-2">{passwordError}</div>}

                                <button type="submit" className="btn btn-primary px-4 py-2" disabled={passwordUpdating} style={{ backgroundColor: 'var(--brand-indigo)', border: 'none' }}>
                                    {passwordUpdating ? 'Updating...' : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="card shadow-sm mb-5" style={{ borderRadius: '16px', border: '1px solid #fee2e2', backgroundColor: 'var(--card-bg)' }}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="fw-semibold text-danger mb-4">Danger Zone</h3>
                            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                                Once you delete your account, there is no going back. Please be certain. 
                                This will permanently delete your personal information, uploaded resumes, and all analysis history.
                            </p>
                            
                            {deleteModalOpen ? (
                                <div className="p-4 rounded border border-danger" style={{ backgroundColor: 'var(--bg-color)' }}>
                                    <h5 className="text-danger mb-3">Are you absolutely sure?</h5>
                                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>This action cannot be undone. All your data will be permanently erased.</p>
                                    <div className="d-flex gap-3">
                                        <button 
                                            className="btn btn-danger px-4" 
                                            onClick={handleDeleteAccount}
                                            disabled={deleteDeleting}
                                        >
                                            {deleteDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary px-4" 
                                            onClick={() => setDeleteModalOpen(false)}
                                            disabled={deleteDeleting}
                                            style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-outline-danger px-4 py-2" 
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    Delete Account
                                </button>
                            )}
                        </div>
                    </section>

                </div>
            </main>
            
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}
        </div>
    );
};

export default Settings;




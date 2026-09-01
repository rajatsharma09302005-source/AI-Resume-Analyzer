import logoLight from '../assets/LOGO.png';
import logoDark from '../assets/LOGO DARK MODE.png';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/dashboard.css'; // reusing dashboard styles for sidebar/layout
import { Trash2 } from 'lucide-react';

const AnalysisHistory = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysisToDelete, setAnalysisToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/resumes/');
                setAnalyses(response.data);
            } catch (err) {
                console.error('Error fetching history:', err);
                setError('Failed to load analysis history. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async () => {
        if (!analysisToDelete) return;
        try {
            setDeleteLoading(true);
            await api.delete(`/resumes/${analysisToDelete}/`);
            setAnalyses(analyses.filter(a => a.id !== analysisToDelete));
            setAnalysisToDelete(null);
        } catch (err) {
            console.error('Error deleting analysis:', err);
            alert('Failed to delete the analysis. Please try again.');
        } finally {
            setDeleteLoading(false);
        }
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

    const getScoreColor = (score) => {
        if (!score && score !== 0) return 'var(--text-muted)'; // grey
        if (score >= 80) return '#22c55e'; // green
        if (score >= 60) return '#eab308'; // yellow
        return '#ef4444'; // red
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
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
                            navigate('/settings');
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
                    
                    <header className="hero-section" style={{ padding: '2rem', marginBottom: '0' }}>
                        <div className="hero-content">
                            <h1 className="hero-title">Analysis History</h1>
                            <p className="hero-subtitle">
                                Review your past resume evaluations and track your progress.
                            </p>
                        </div>
                    </header>

                    <section className="content-section" style={{ padding: '2rem' }}>
                        {loading ? (
                            <div className="loading-state" style={{ textAlign: 'center', padding: '4rem' }}>
                                <div className="spinner" style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--brand-indigo)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                                <p style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state" style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Oops! Something went wrong</h3>
                                <p style={{ color: '#ef4444', marginBottom: '1.5rem' }}>{error}</p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
                                    <button className="btn-outline-primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
                                </div>
                            </div>
                        ) : analyses.length === 0 ? (
                            <div className="empty-state-card" style={{ padding: '4rem 2rem' }}>
                                <div className="empty-icon-large" style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                                <h3>No Resume Analyses Yet</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>Upload your first resume and compare it against a job description to get started.</p>
                                <button className="btn-primary-large" onClick={() => navigate('/analyze')}>
                                    Analyze Resume
                                </button>
                            </div>
                        ) : (
                            <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {analyses.map(analysis => (
                                    <div key={analysis.id} className="history-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px var(--shadow-color)', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ flex: '1', minWidth: '250px' }}>
                                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                                                {analysis.resume_file ? analysis.resume_file.split('/').pop() : 'Unnamed Resume'}
                                            </h4>
                                            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {analysis.job_description || 'No job description provided'}
                                            </p>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {formatDate(analysis.created_at)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysis.score) }}>
                                                    {analysis.score != null ? `${analysis.score}%` : 'N/A'}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Score
                                                </div>
                                            </div>
                                            <button 
                                                className="btn-outline-primary"
                                                onClick={() => navigate(`/analysis/${analysis.id}`)}
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                View Analysis
                                            </button>
                                            <button
                                                className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                                                onClick={() => setAnalysisToDelete(analysis.id)}
                                                style={{ padding: '0.5rem', width: '38px', height: '38px' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Delete Confirmation Modal */}
            {analysisToDelete && (
                <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', zIndex:1050, display:'flex', alignItems:'center', justifyContent:'center', padding: '1rem'}}>
                    <div className="card shadow-sm" style={{borderRadius:'16px', width:'100%', maxWidth:'500px', border: '1px solid #fee2e2', backgroundColor: 'var(--card-bg)'}}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="fw-semibold text-danger mb-4">Danger Zone</h3>
                            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                                Once you delete this analysis, there is no going back. Please be certain.
                            </p>
                            
                            <div className="p-4 rounded border border-danger" style={{ backgroundColor: 'var(--bg-color)' }}>
                                <h5 className="text-danger mb-3">Are you absolutely sure?</h5>
                                <p className="mb-4" style={{ color: 'var(--text-primary)' }}>This action cannot be undone. All data for this analysis will be permanently erased.</p>
                                <div className="d-flex flex-wrap gap-3">
                                    <button 
                                        className="btn btn-danger px-4" 
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? 'Deleting...' : 'Yes, Delete Analysis'}
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary px-4" 
                                        onClick={() => setAnalysisToDelete(null)}
                                        disabled={deleteLoading}
                                        style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .history-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .history-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
            `}</style>
        </div>
    );
};

export default AnalysisHistory;




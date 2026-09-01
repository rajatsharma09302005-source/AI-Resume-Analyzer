import logoLight from '../assets/LOGO.png';
import logoDark from '../assets/LOGO DARK MODE.png';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/dashboard.css';

const Insights = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/resumes/');
            setAnalyses(response.data);
        } catch (err) {
            console.error("Failed to load insights:", err);
            setError('Unable to load insights');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

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

    // Calculate metrics
    const validAnalyses = analyses.filter(a => typeof a.score === 'number');
    const analysesCompleted = analyses.length;
    
    const averageScore = validAnalyses.length > 0 
        ? Math.round(validAnalyses.reduce((sum, a) => sum + a.score, 0) / validAnalyses.length) 
        : 0;
        
    const bestScore = validAnalyses.length > 0 
        ? Math.max(...validAnalyses.map(a => a.score)) 
        : 0;
        
    const jobMatches = validAnalyses.filter(a => a.score >= 70).length;

    // Categories calculation
    const categoryAverages = {
        'Technical Skills': { sum: 0, count: 0 },
        'Experience': { sum: 0, count: 0 },
        'Keywords': { sum: 0, count: 0 },
        'Projects': { sum: 0, count: 0 },
        'Education': { sum: 0, count: 0 }
    };

    analyses.forEach(a => {
        if (a.analysis_result) {
            if (typeof a.analysis_result.skills_score === 'number') { categoryAverages['Technical Skills'].sum += a.analysis_result.skills_score; categoryAverages['Technical Skills'].count++; }
            if (typeof a.analysis_result.experience_score === 'number') { categoryAverages['Experience'].sum += a.analysis_result.experience_score; categoryAverages['Experience'].count++; }
            if (typeof a.analysis_result.keyword_score === 'number') { categoryAverages['Keywords'].sum += a.analysis_result.keyword_score; categoryAverages['Keywords'].count++; }
            if (typeof a.analysis_result.project_score === 'number') { categoryAverages['Projects'].sum += a.analysis_result.project_score; categoryAverages['Projects'].count++; }
            if (typeof a.analysis_result.education_score === 'number') { categoryAverages['Education'].sum += a.analysis_result.education_score; categoryAverages['Education'].count++; }
        }
    });

    const categories = Object.entries(categoryAverages)
        .filter(([_, data]) => data.count > 0)
        .map(([name, data]) => ({
            name,
            average: Math.round(data.sum / data.count)
        }))
        .sort((a, b) => b.average - a.average);

    const strongestArea = categories.length > 0 ? categories[0] : null;
    const weakestArea = categories.length > 0 ? categories[categories.length - 1] : null;

    // Missing Skills
    const missingSkillsMap = {};
    analyses.forEach(a => {
        if (a.analysis_result?.missing_skills && Array.isArray(a.analysis_result.missing_skills)) {
            a.analysis_result.missing_skills.forEach(skill => {
                const normalized = skill.trim().toLowerCase();
                if (normalized) {
                    missingSkillsMap[normalized] = {
                        original: skill.trim(),
                        count: (missingSkillsMap[normalized]?.count || 0) + 1
                    };
                }
            });
        }
    });

    const topMissingSkills = Object.values(missingSkillsMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Recommendations
    const recommendationsMap = {};
    analyses.forEach(a => {
        if (a.analysis_result?.recommendations && Array.isArray(a.analysis_result.recommendations)) {
            a.analysis_result.recommendations.forEach(rec => {
                const normalized = rec.trim().toLowerCase();
                if (normalized && normalized.length > 10) {
                    recommendationsMap[normalized] = {
                        original: rec.trim(),
                        count: (recommendationsMap[normalized]?.count || 0) + 1
                    };
                }
            });
        }
    });

    const topRecommendations = Object.values(recommendationsMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    // Score Trend Chart Data
    const sortedForChart = [...validAnalyses].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    // Calculate performance progress
    let progressText = "Complete more analyses to see your resume performance trend.";
    if (sortedForChart.length >= 2) {
        const firstAnalysis = sortedForChart[0].score;
        const recentAnalysis = sortedForChart[sortedForChart.length - 1].score;
        const diff = recentAnalysis - firstAnalysis;
        
        if (diff > 0) {
            progressText = `Your score has improved by ${diff}% compared with your earliest analysis.`;
        } else if (diff < 0) {
            progressText = `Your recent scores are ${Math.abs(diff)}% lower compared with your earliest analysis.`;
        } else {
            progressText = `Your scores have remained consistent since your earliest analysis.`;
        }
    }

    const renderChart = () => {
        if (sortedForChart.length < 2) {
            return (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Need at least 2 analyses to show trend.</p>
                </div>
            );
        }

        const width = 100;
        const height = 60;
        const padding = 10;
        
        const minX = new Date(sortedForChart[0].created_at).getTime();
        const maxX = new Date(sortedForChart[sortedForChart.length - 1].created_at).getTime();
        const timeRange = maxX - minX || 1;
        
        const points = sortedForChart.map(a => {
            const time = new Date(a.created_at).getTime();
            const x = padding + ((time - minX) / timeRange) * (width - 2 * padding);
            const y = height - padding - (a.score / 100) * (height - 2 * padding);
            return `${x},${y}`;
        });

        const formatDate = (dateString) => {
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateString));
        };

        return (
            <div style={{ width: '100%', height: '250px', position: 'relative' }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(val => (
                        <line 
                            key={val}
                            x1={padding} 
                            y1={height - padding - (val / 100) * (height - 2 * padding)} 
                            x2={width - padding} 
                            y2={height - padding - (val / 100) * (height - 2 * padding)} 
                            stroke="var(--border-color)" 
                            strokeWidth="0.5"
                        />
                    ))}
                    
                    {/* Y-axis labels */}
                    {[0, 50, 100].map(val => (
                        <text 
                            key={`y-${val}`}
                            x={padding - 2} 
                            y={height - padding - (val / 100) * (height - 2 * padding) + 2} 
                            fontSize="3" 
                            fill="var(--text-muted)" 
                            textAnchor="end"
                        >
                            {val}
                        </text>
                    ))}

                    {/* Data Line */}
                    <polyline 
                        fill="none" 
                        stroke="var(--brand-indigo)" 
                        strokeWidth="1.5" 
                        points={points.join(' ')} 
                    />

                    {/* Data Points */}
                    {sortedForChart.map((a, i) => {
                        const time = new Date(a.created_at).getTime();
                        const x = padding + ((time - minX) / timeRange) * (width - 2 * padding);
                        const y = height - padding - (a.score / 100) * (height - 2 * padding);
                        return (
                            <circle key={i} cx={x} cy={y} r="1.5" fill="var(--brand-indigo)" stroke="var(--bg-card)" strokeWidth="0.5" />
                        );
                    })}
                </svg>
                
                {/* X-axis labels overlay */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingLeft: '10%', paddingRight: '10%' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(sortedForChart[0].created_at)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(sortedForChart[sortedForChart.length - 1].created_at)}</span>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="dashboard-layout has-secondary">
                <main className="dashboard-main" style={{ width: '100%', margin: 0, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="empty-state-card" style={{ maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <div className="empty-icon-large" style={{ color: '#ef4444' }}>⚠️</div>
                        <h3 style={{ color: 'var(--text-primary)' }}>Unable to load insights</h3>
                        <p style={{ color: '#ef4444' }}>{error}</p>
                        <p style={{ color: 'var(--text-secondary)' }}>We couldn't retrieve your analysis history.</p>
                        <button className="btn-primary-large" onClick={fetchInsights}>
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }

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

            {/* Main Content Area */}
            <main className="dashboard-main" style={{ marginRight: 0, padding: '2rem' }}>
                <div className="main-content-scroll" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                    
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-3">
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Resume Insights</h1>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Understand how your resume performs across different job opportunities.</p>
                        </div>
                        <button 
                            className="btn-primary-large" 
                            onClick={() => navigate('/analyze')}
                            style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem' }}
                        >
                            Analyze Resume &rarr;
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <h4 className="fw-semibold text-dark">Gathering Insights...</h4>
                        </div>
                    ) : analyses.length === 0 ? (
                        <div className="empty-state-card mt-5">
                            <div className="empty-icon-large">📈</div>
                            <h3>No Insights Yet</h3>
                            <p>Analyze your first resume to start seeing your resume performance trends and insights.</p>
                            <button className="btn-primary-large mt-3" onClick={() => navigate('/analyze')}>
                                Analyze Resume
                            </button>
                        </div>
                    ) : (
                        <div className="insights-content">
                            {/* Stats Row */}
                            <div className="stats-container mb-4">
                                <div className="stat-box">
                                    <div className="stat-header">
                                        <span className="stat-icon">🎯</span>
                                        <span className="stat-title">Average ATS Score</span>
                                    </div>
                                    <div className="stat-value">{averageScore}%</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-header">
                                        <span className="stat-icon">🏆</span>
                                        <span className="stat-title">Best Score</span>
                                    </div>
                                    <div className="stat-value">{bestScore}%</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-header">
                                        <span className="stat-icon">📊</span>
                                        <span className="stat-title">Analyses Completed</span>
                                    </div>
                                    <div className="stat-value">{analysesCompleted}</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-header">
                                        <span className="stat-icon">💼</span>
                                        <span className="stat-title">Job Matches</span>
                                    </div>
                                    <div className="stat-value">{jobMatches}</div>
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                {/* Score Trend */}
                                <div className="col-lg-8">
                                    <div className="card shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Performance Trend</h4>
                                            {renderChart()}
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Summary */}
                                <div className="col-lg-4">
                                    <div className="card shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: 'var(--brand-indigo)', color: 'white' }}>
                                        <div className="card-body p-4 d-flex flex-column justify-content-center">
                                            <h4 className="fw-semibold text-white mb-4">Your Progress</h4>
                                            <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
                                                {progressText}
                                            </p>
                                            <p className="mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
                                                You have completed {analysesCompleted} resume {analysesCompleted === 1 ? 'analysis' : 'analyses'} and matched {jobMatches} job {jobMatches === 1 ? 'opportunity' : 'opportunities'} with a score of 70 or higher.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                {/* Strongest Area */}
                                <div className="col-md-6">
                                    <div className="card shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '4px solid #10b981', backgroundColor: 'var(--bg-card)' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Your Strongest Area</h4>
                                            {strongestArea ? (
                                                <>
                                                    <h3 className="text-success mb-2">{strongestArea.name}</h3>
                                                    <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Average Score</p>
                                                    <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>{strongestArea.average}%</h2>
                                                    <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>You consistently perform strongly in {strongestArea.name.toLowerCase()} matching.</p>
                                                </>
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)' }}>Not enough data to determine.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Area to Improve */}
                                <div className="col-md-6">
                                    <div className="card shadow-sm h-100" style={{ borderRadius: '16px', borderLeft: '4px solid #f59e0b', backgroundColor: 'var(--bg-card)' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Area to Improve</h4>
                                            {weakestArea ? (
                                                <>
                                                    <h3 className="text-warning mb-2">{weakestArea.name}</h3>
                                                    <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Average Score</p>
                                                    <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>{weakestArea.average}%</h2>
                                                    <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>Your {weakestArea.name.toLowerCase()} alignment is currently your weakest scoring area.</p>
                                                </>
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)' }}>Not enough data to determine.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                {/* Most Missing Skills */}
                                <div className="col-md-6">
                                    <div className="card shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Most Missing Skills</h4>
                                            {topMissingSkills.length > 0 ? (
                                                <div className="d-flex flex-column gap-3">
                                                    {topMissingSkills.map((skill, index) => {
                                                        const maxCount = topMissingSkills[0].count;
                                                        const width = `${(skill.count / maxCount) * 100}%`;
                                                        return (
                                                            <div key={index}>
                                                                <div className="d-flex justify-content-between mb-1">
                                                                    <span className="fw-medium" style={{ color: 'var(--text-primary)' }}>{skill.original}</span>
                                                                    <span className="small" style={{ color: 'var(--text-secondary)' }}>Appeared in {skill.count} analyses</span>
                                                                </div>
                                                                <div className="progress" style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-input)' }}>
                                                                    <div 
                                                                        className="progress-bar bg-warning" 
                                                                        style={{ width, borderRadius: '4px' }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <div className="mb-2 fs-1">🎉</div>
                                                    <h5 className="text-success">Great job!</h5>
                                                    <p className="text-secondary mb-0">No recurring missing skills have been identified yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Common Recommendations */}
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold text-dark mb-4">Recurring Recommendations</h4>
                                            {topRecommendations.length > 0 ? (
                                                <div className="d-flex flex-column gap-3">
                                                    {topRecommendations.map((rec, index) => (
                                                        <div key={index} className="d-flex p-3 bg-light rounded align-items-start">
                                                            <div className="fw-bold text-primary me-3 fs-5">
                                                                {(index + 1).toString().padStart(2, '0')}
                                                            </div>
                                                            <div>
                                                                <p className="text-dark fw-medium mb-1">{rec.original}</p>
                                                                <p className="text-secondary small mb-0">Suggested {rec.count} times</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-secondary mb-0">No recurring recommendations found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}
        </div>
    );
};

export default Insights;




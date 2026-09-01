import logoLight from '../assets/LOGO.png';
import logoDark from '../assets/LOGO DARK MODE.png';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';
import { 
    FileText, 
    CheckCircle, 
    AlertTriangle,
    Target,
    ArrowLeft,
    Lightbulb,
    FileSearch,
    Award,
    Briefcase,
    GraduationCap,
    Trash2
} from 'lucide-react';

const Analysis = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const response = await api.get(`resumes/${id}/`);
                setAnalysisData(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to load analysis:", err);
                if (err.response && err.response.status === 404) {
                    setError('Analysis not found.');
                } else {
                    setError('Unable to load this analysis. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [id]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await api.delete(`resumes/${id}/`);
            navigate('/history');
        } catch (err) {
            console.error("Failed to delete analysis:", err);
            alert("Failed to delete the analysis. Please try again.");
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

    // Helper to get score color
    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 60) return '#f59e0b'; // Orange/Yellow
        return '#ef4444'; // Red
    };

    const getScoreText = (score) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 60) return 'Good Match';
        if (score >= 40) return 'Moderate Match';
        return 'Needs Improvement';
    };

    // Progress Bar Component
    const ProgressBar = ({ label, score, icon }) => (
        <div className="progress-item mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center gap-2">
                    {icon && <span className="text-secondary">{icon}</span>}
                    <span className="fw-medium text-dark">{label}</span>
                </div>
                <span className="fw-bold" style={{ color: getScoreColor(score) }}>{score}%</span>
            </div>
            <div className="progress bg-light" style={{ height: '8px', borderRadius: '4px' }}>
                <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                        width: `${score}%`, 
                        backgroundColor: getScoreColor(score),
                        borderRadius: '4px'
                    }} 
                    aria-valuenow={score} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
    );

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
                            className={`nav-item ${location.pathname === item.path || (item.path === '/analyze' && location.pathname.startsWith('/analysis')) ? 'active' : ''}`}
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
                <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                    
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-3">
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Resume Analysis</h1>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>AI-powered insights to help you improve your resume.</p>
                        </div>
                        <div className="d-flex gap-2">
                            {analysisData && (
                                <button 
                                    className="btn btn-outline-danger d-flex align-items-center px-4 py-2" 
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 size={18} className="me-2" /> Delete Analysis
                                </button>
                            )}
                            <button 
                                className="btn d-flex align-items-center" 
                                onClick={() => navigate('/analyze')}
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border-color)', 
                                    color: 'var(--text-primary)', 
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    padding: '0.5rem 1rem'
                                }}
                            >
                                <ArrowLeft size={18} className="me-2" /> Analyze Another Resume
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <h4 className="fw-semibold text-dark">Analyzing Resume...</h4>
                            <p className="text-secondary">Loading your AI-powered insights</p>
                        </div>
                    ) : error ? (
                        <div className="card border-0 shadow-sm text-center py-5 my-5" style={{ borderRadius: '16px' }}>
                            <div className="card-body">
                                <AlertTriangle size={48} className="text-danger mb-3" />
                                <h4 className="fw-semibold text-dark mb-2">{error}</h4>
                                <p className="text-secondary mb-4">There was a problem retrieving the analysis data.</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-outline-primary px-4" onClick={() => window.location.reload()}>Try Again</button>
                                    <button className="btn btn-primary px-4" onClick={() => navigate('/analyze')} style={{ backgroundColor: 'var(--brand-indigo)', border: 'none' }}>Back to Analyze</button>
                                </div>
                            </div>
                        </div>
                    ) : analysisData && analysisData.analysis_result ? (
                        <div className="analysis-results">
                            
                            {/* Top Row: Score and Breakdown */}
                            <div className="row mb-4">
                                {/* Overall Score */}
                                <div className="col-lg-5 mb-4 mb-lg-0">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
                                            <h3 className="card-title fw-semibold text-dark mb-4 w-100 text-start">Overall Score</h3>
                                            
                                            <div className="position-relative mb-4" style={{ width: '180px', height: '180px' }}>
                                                <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '100%', height: '100%' }}>
                                                    <path className="circle-bg"
                                                        d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        style={{ fill: 'none', stroke: 'var(--border-color)', strokeWidth: '3' }}
                                                    />
                                                    <path className="circle"
                                                        strokeDasharray={`${analysisData.analysis_result.overall_score || analysisData.score}, 100`}
                                                        d="M18 2.0845
                                                        a 15.9155 15.9155 0 0 1 0 31.831
                                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        style={{ 
                                                            fill: 'none', 
                                                            stroke: getScoreColor(analysisData.analysis_result.overall_score || analysisData.score), 
                                                            strokeWidth: '3', 
                                                            strokeLinecap: 'round',
                                                            animation: 'progress 1s ease-out forwards'
                                                        }}
                                                    />
                                                </svg>
                                                <div className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center">
                                                    <span className="fw-bold text-dark" style={{ fontSize: '2.5rem', lineHeight: '1' }}>
                                                        {analysisData.analysis_result.overall_score || analysisData.score}
                                                    </span>
                                                    <span className="text-secondary small fw-medium">/ 100</span>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                className="fw-semibold px-4 py-2 rounded-pill"
                                                style={{ 
                                                    backgroundColor: `${getScoreColor(analysisData.analysis_result.overall_score || analysisData.score)}15`,
                                                    color: getScoreColor(analysisData.analysis_result.overall_score || analysisData.score)
                                                }}
                                            >
                                                {getScoreText(analysisData.analysis_result.overall_score || analysisData.score)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Score Breakdown */}
                                <div className="col-lg-7">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <h3 className="card-title fw-semibold text-dark mb-4">Score Breakdown</h3>
                                            <div className="mt-2 d-flex flex-column justify-content-between h-100 pb-4">
                                                <ProgressBar label="Skills Match" score={analysisData.analysis_result.skills_score || 0} icon={<Target size={16} />} />
                                                <ProgressBar label="Experience" score={analysisData.analysis_result.experience_score || 0} icon={<Briefcase size={16} />} />
                                                <ProgressBar label="Keywords" score={analysisData.analysis_result.keyword_score || 0} icon={<FileSearch size={16} />} />
                                                <ProgressBar label="Projects" score={analysisData.analysis_result.project_score || 0} icon={<Award size={16} />} />
                                                <ProgressBar label="Education" score={analysisData.analysis_result.education_score || 0} icon={<GraduationCap size={16} />} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Summary */}
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', backgroundColor: 'var(--bg-card)' }}>
                                <div className="card-body p-4 border-start border-4 rounded-start" style={{ borderColor: '#3F46E8' }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                            <Lightbulb size={24} color="#3F46E8" />
                                        </div>
                                        <h3 className="card-title fw-semibold text-dark mb-0">AI Summary</h3>
                                    </div>
                                    <p className="card-text text-secondary lh-lg mb-0" style={{ fontSize: '1.05rem' }}>
                                        {analysisData.analysis_result.summary}
                                    </p>
                                </div>
                            </div>

                            {/* 2 Columns: Strengths, Missing */}
                            <div className="row mb-4 g-4">
                                {/* Strengths */}
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                                                <CheckCircle className="text-success me-2" size={20} /> Your Strengths
                                            </h4>
                                            {analysisData.analysis_result.strengths && analysisData.analysis_result.strengths.length > 0 ? (
                                                <ul className="list-unstyled mb-0 gap-3 d-flex flex-column">
                                                    {analysisData.analysis_result.strengths.map((strength, index) => (
                                                        <li key={index} className="d-flex align-items-start text-secondary">
                                                            <CheckCircle className="text-success mt-1 me-2 flex-shrink-0" size={16} />
                                                            <span>{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-muted fst-italic">No specific strengths identified.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                                                <AlertTriangle className="text-warning me-2" size={20} /> Missing Skills
                                            </h4>
                                            {analysisData.analysis_result.missing_skills && analysisData.analysis_result.missing_skills.length > 0 ? (
                                                <ul className="list-unstyled mb-0 gap-3 d-flex flex-column">
                                                    {analysisData.analysis_result.missing_skills.map((skill, index) => (
                                                        <li key={index} className="d-flex align-items-start text-secondary">
                                                            <AlertTriangle className="text-warning mt-1 me-2 flex-shrink-0" size={16} />
                                                            <span>{skill}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center mt-4">
                                                    <CheckCircle size={32} className="text-success mb-2" />
                                                    <p className="text-success fw-medium mb-0">Great! No significant missing skills were identified.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations Row */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#F0F1FF' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                                                <Target className="text-primary me-2" size={20} /> AI Recommendations
                                            </h4>
                                            {analysisData.analysis_result.recommendations && analysisData.analysis_result.recommendations.length > 0 ? (
                                                <ul className="list-unstyled mb-0 gap-3 d-flex flex-column">
                                                    {analysisData.analysis_result.recommendations.map((rec, index) => (
                                                        <li key={index} className="d-flex align-items-start">
                                                            <span className="fw-bold text-primary me-3 mt-1" style={{ fontSize: '0.9rem', minWidth: '20px' }}>
                                                                {index + 1}
                                                            </span>
                                                            <span className="text-dark fw-medium">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-muted fst-italic">No specific recommendations.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Resume and Job Description */}
                            <div className="row g-4 mb-5">
                                {/* Job Description */}
                                <div className="col-lg-5">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <h4 className="fw-semibold text-dark mb-3">Target Job Description</h4>
                                            <div 
                                                className="p-3 bg-light rounded text-secondary" 
                                                style={{ height: '400px', overflowY: 'auto', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}
                                            >
                                                {analysisData.job_description || 'No job description provided.'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Preview */}
                                <div className="col-lg-7">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h4 className="fw-semibold text-dark mb-0">Resume Document</h4>
                                                <a 
                                                    href={analysisData.resume_file} 
                                                    target={analysisData.resume_file && analysisData.resume_file.toLowerCase().endsWith('.pdf') ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                    download={analysisData.resume_file && !analysisData.resume_file.toLowerCase().endsWith('.pdf')}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    {analysisData.resume_file && analysisData.resume_file.toLowerCase().endsWith('.pdf') ? 'Open in New Tab' : 'Download Resume'}
                                                </a>
                                            </div>
                                            {analysisData.resume_file && analysisData.resume_file.toLowerCase().endsWith('.pdf') ? (
                                                <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                                    <iframe 
                                                        src={analysisData.resume_file} 
                                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                                        title="Resume Preview"
                                                    >
                                                        <p className="text-center mt-5">This browser does not support inline PDFs. <a href={analysisData.resume_file}>Download it here</a>.</p>
                                                    </iframe>
                                                </div>
                                            ) : (
                                                <div style={{ height: '400px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} className="d-flex flex-column align-items-center justify-content-center">
                                                    <div className="text-center p-4">
                                                        <FileText size={48} className="text-secondary mb-3 mx-auto" />
                                                        <h5 className="fw-medium text-dark mb-2">DOCX Document</h5>
                                                        <p className="text-secondary mb-4">Inline preview is not available for DOCX files.</p>
                                                        <a 
                                                            href={analysisData.resume_file} 
                                                            className="btn btn-primary d-inline-flex align-items-center"
                                                            download
                                                        >
                                                            <FileText size={18} className="me-2" />
                                                            Download Resume
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ) : null}
                </div>
            </main>
            
            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
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
                                        onClick={() => setShowDeleteModal(false)}
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
        </div>
    );
};

export default Analysis;




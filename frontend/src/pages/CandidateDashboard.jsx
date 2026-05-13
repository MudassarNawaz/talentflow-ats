import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, interviewsAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineUpload, HiOutlinePencil, HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle, HiOutlineStar } from 'react-icons/hi';

const CandidateDashboard = () => {
  const { user, updateUser, loadUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '', phone: '', headline: '', skills: '', experience: '', education: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        headline: user.headline || '',
        skills: user.skills?.join(', ') || '',
        experience: user.experience || '',
        education: user.education || '',
      });
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, interviewsRes] = await Promise.all([
        applicationsAPI.getMy(),
        interviewsAPI.getMy(),
      ]);
      setApplications(appsRes.data.applications);
      setInterviews(interviewsRes.data.interviews);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.updateProfile(profileData);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return toast.error('Select a PDF file');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const { data } = await authAPI.uploadResume(formData);
      toast.success('Resume uploaded!');
      setResumeFile(null);
      await loadUser();
    } catch (err) {
      toast.error('Upload failed');
    } finally { setUploading(false); }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'Submitted': return <HiOutlineClock className="status-icon submitted" />;
      case 'Under Review': return <HiOutlineClock className="status-icon review" />;
      case 'Shortlisted': return <HiOutlineStar className="status-icon shortlisted" />;
      case 'Interview Scheduled': return <HiOutlineCalendar className="status-icon interview" />;
      case 'Selected': return <HiOutlineCheckCircle className="status-icon selected" />;
      case 'Rejected': return <HiOutlineXCircle className="status-icon rejected" />;
      default: return <HiOutlineClock className="status-icon" />;
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Manage your profile and track your job applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}><HiOutlineBriefcase /></div>
          <div className="stat-info">
            <span className="stat-number">{applications.length}</span>
            <span className="stat-label">Applications</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><HiOutlineCalendar /></div>
          <div className="stat-info">
            <span className="stat-number">{interviews.length}</span>
            <span className="stat-label">Interviews</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}><HiOutlineStar /></div>
          <div className="stat-info">
            <span className="stat-number">{applications.filter(a => a.status === 'Shortlisted').length}</span>
            <span className="stat-label">Shortlisted</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}><HiOutlineCheckCircle /></div>
          <div className="stat-info">
            <span className="stat-number">{applications.filter(a => a.status === 'Selected').length}</span>
            <span className="stat-label">Selected</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <HiOutlineBriefcase /> Applications
        </button>
        <button className={`tab-btn ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => setActiveTab('interviews')}>
          <HiOutlineCalendar /> Interviews
        </button>
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <HiOutlineUser /> Profile
        </button>
        <button className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
          <HiOutlineDocumentText /> Resume
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="applications-list">
            {applications.length === 0 ? (
              <div className="empty-state">
                <HiOutlineBriefcase className="empty-icon" />
                <h3>No applications yet</h3>
                <p>Browse available jobs and start applying!</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="application-card">
                  <div className="app-card-main">
                    <div className="app-card-info">
                      <h3>{app.job?.title || 'Job Removed'}</h3>
                      <p className="app-dept">{app.job?.department} • {app.job?.branch?.name}</p>
                      <p className="app-date">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="app-card-status">
                      {statusIcon(app.status)}
                      <span className={`status-badge status-${app.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  {/* Status Progress Bar */}
                  <div className="status-progress">
                    {['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'].map((s, i) => (
                      <div key={s} className={`progress-step ${
                        ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected']
                          .indexOf(app.status) >= i ? 'active' : ''
                      } ${app.status === 'Rejected' ? 'rejected' : ''}`}>
                        <div className="progress-dot"></div>
                        <span className="progress-label">{s.replace('Interview Scheduled', 'Interview')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="interviews-list">
            {interviews.length === 0 ? (
              <div className="empty-state">
                <HiOutlineCalendar className="empty-icon" />
                <h3>No interviews scheduled</h3>
                <p>Interviews will appear here when scheduled by HR</p>
              </div>
            ) : (
              interviews.map((interview) => (
                <div key={interview._id} className="interview-card">
                  <div className="interview-date-badge">
                    <span className="interview-month">{new Date(interview.scheduledDate).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="interview-day">{new Date(interview.scheduledDate).getDate()}</span>
                  </div>
                  <div className="interview-info">
                    <h3>{interview.job?.title}</h3>
                    <p>🕐 {interview.scheduledTime} • {interview.type}</p>
                    {interview.location && <p>📍 {interview.location}</p>}
                    {interview.message && <p className="interview-msg">💬 {interview.message}</p>}
                  </div>
                  <span className={`status-badge status-${interview.status.toLowerCase()}`}>{interview.status}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header-row">
              <h2>Profile Information</h2>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)}>
                <HiOutlinePencil /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editing ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group"><label>Full Name</label><input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} /></div>
                  <div className="form-group"><label>Phone</label><input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} /></div>
                </div>
                <div className="form-group"><label>Headline</label><input type="text" value={profileData.headline} onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })} placeholder="e.g., Full Stack Developer" /></div>
                <div className="form-group"><label>Skills (comma-separated)</label><input type="text" value={profileData.skills} onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })} placeholder="React, Node.js, MongoDB" /></div>
                <div className="form-group"><label>Experience</label><textarea value={profileData.experience} onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })} rows="3" placeholder="Brief work experience..." /></div>
                <div className="form-group"><label>Education</label><textarea value={profileData.education} onChange={(e) => setProfileData({ ...profileData, education: e.target.value })} rows="2" placeholder="e.g., BS Computer Science - FAST NUCES" /></div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : (
              <div className="profile-display">
                <div className="profile-field"><label>Name</label><p>{user?.name}</p></div>
                <div className="profile-field"><label>Email</label><p>{user?.email}</p></div>
                <div className="profile-field"><label>Phone</label><p>{user?.phone || '—'}</p></div>
                <div className="profile-field"><label>Headline</label><p>{user?.headline || '—'}</p></div>
                <div className="profile-field"><label>Skills</label>
                  <div className="skills-tags">{user?.skills?.length ? user.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>) : '—'}</div>
                </div>
                <div className="profile-field"><label>Experience</label><p>{user?.experience || '—'}</p></div>
                <div className="profile-field"><label>Education</label><p>{user?.education || '—'}</p></div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="resume-section">
            <h2>Resume Management</h2>
            {user?.resumeUrl ? (
              <div className="resume-current">
                <HiOutlineDocumentText className="resume-icon" />
                <div>
                  <p>Resume uploaded ✅</p>
                  <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View Resume</a>
                </div>
              </div>
            ) : (
              <p className="text-muted">No resume uploaded yet</p>
            )}
            <div className="resume-upload">
              <h3>Upload New Resume (PDF only)</h3>
              <div className="upload-area">
                <HiOutlineUpload className="upload-icon" />
                <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                {resumeFile && <p className="file-name">{resumeFile.name}</p>}
              </div>
              <button className="btn btn-primary" onClick={handleResumeUpload} disabled={!resumeFile || uploading}>
                {uploading ? <span className="btn-loader"></span> : 'Upload Resume'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;

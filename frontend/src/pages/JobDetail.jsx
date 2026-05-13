import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineUsers, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    loadJob();
    if (user?.role === 'candidate') checkIfApplied();
  }, [id]);

  const loadJob = async () => {
    try {
      const { data } = await jobsAPI.getOne(id);
      setJob(data.job);
    } catch (err) {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const { data } = await applicationsAPI.getMy();
      const hasApplied = data.applications.some(app => app.job?._id === id);
      setApplied(hasApplied);
    } catch (err) { /* ignore */ }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (!user.resumeUrl) {
      toast.error('Please upload your resume in your profile first');
      navigate('/candidate/dashboard');
      return;
    }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      await applicationsAPI.apply(formData);
      toast.success('Application submitted successfully!');
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary?.min && !salary?.max) return 'Competitive';
    const fmt = (n) => n?.toLocaleString();
    if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)} ${salary.currency || 'PKR'}`;
    if (salary.min) return `From ${fmt(salary.min)} ${salary.currency || 'PKR'}`;
    return `Up to ${fmt(salary.max)} ${salary.currency || 'PKR'}`;
  };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (!job) return null;

  return (
    <div className="job-detail-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/jobs')}>
        <HiOutlineArrowLeft /> Back to Jobs
      </button>

      <div className="job-detail-container">
        <div className="job-detail-main">
          <div className="job-detail-header">
            <div>
              <span className="job-type-badge" style={{
                background: job.type === 'Remote' ? '#06b6d4' : job.type === 'Full-Time' ? '#6366f1' : '#f59e0b'
              }}>{job.type}</span>
              <h1>{job.title}</h1>
              <p className="job-detail-dept">{job.department}</p>
            </div>
          </div>

          <div className="job-detail-meta-grid">
            <div className="meta-item">
              <HiOutlineLocationMarker />
              <div>
                <span className="meta-label">Location</span>
                <span className="meta-value">{job.branch?.name} — {job.branch?.city}</span>
              </div>
            </div>
            <div className="meta-item">
              <HiOutlineCurrencyDollar />
              <div>
                <span className="meta-label">Salary</span>
                <span className="meta-value">{formatSalary(job.salary)}</span>
              </div>
            </div>
            <div className="meta-item">
              <HiOutlineBriefcase />
              <div>
                <span className="meta-label">Experience</span>
                <span className="meta-value">{job.experience}</span>
              </div>
            </div>
            <div className="meta-item">
              <HiOutlineUsers />
              <div>
                <span className="meta-label">Open Seats</span>
                <span className="meta-value">{job.seats}</span>
              </div>
            </div>
            <div className="meta-item">
              <HiOutlineClock />
              <div>
                <span className="meta-label">Posted</span>
                <span className="meta-value">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="job-detail-section">
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="job-detail-section">
              <h2>Requirements</h2>
              <ul className="requirements-list">
                {job.requirements.map((req, i) => (
                  <li key={i}><HiOutlineCheckCircle className="req-icon" /> {req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.branch?.address && (
            <div className="job-detail-section">
              <h2>Office Location</h2>
              <p><HiOutlineLocationMarker /> {job.branch.address}</p>
            </div>
          )}
        </div>

        <div className="job-detail-sidebar">
          <div className="apply-card">
            <h3>Interested in this role?</h3>
            <p>Submit your application and our HR team will review it.</p>
            {user?.role === 'candidate' ? (
              applied ? (
                <button className="btn btn-success btn-block" disabled>
                  <HiOutlineCheckCircle /> Already Applied
                </button>
              ) : (
                <button className="btn btn-primary btn-block" onClick={handleApply} disabled={applying}>
                  {applying ? <span className="btn-loader"></span> : 'Apply Now'}
                </button>
              )
            ) : !user ? (
              <button className="btn btn-primary btn-block" onClick={() => navigate('/login')}>
                Login to Apply
              </button>
            ) : (
              <p className="text-muted">HR/Admin accounts cannot apply for jobs</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

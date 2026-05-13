import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineGlobe, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineMail } from 'react-icons/hi';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">🚀 Multi-Branch Recruitment Platform</div>
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Career</span><br />
            With TalentFlow
          </h1>
          <p className="hero-subtitle">
            A professional Applicant Tracking System for modern companies. 
            Streamlined hiring across Islamabad, Lahore, Karachi & Remote offices.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              <HiOutlineBriefcase /> Browse Careers
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">
                Join as Candidate
              </Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">50+</span>
              <span className="hero-stat-label">Open Positions</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">4</span>
              <span className="hero-stat-label">Office Branches</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-label">Hired Talents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose <span className="gradient-text">TalentFlow</span></h2>
          <p>Everything you need for a seamless recruitment experience</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <HiOutlineBriefcase />
            </div>
            <h3>Smart Job Board</h3>
            <p>Browse and filter jobs by branch, department, and type. Apply with one click.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              <HiOutlineUserGroup />
            </div>
            <h3>Applicant Tracking</h3>
            <p>Track your application status in real-time from submission to selection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <HiOutlineGlobe />
            </div>
            <h3>Multi-Branch Support</h3>
            <p>Islamabad, Lahore, Karachi, and Remote — find opportunities near you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <HiOutlineLightningBolt />
            </div>
            <h3>Fast Application</h3>
            <p>Upload your resume via Cloudinary and apply in seconds.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <HiOutlineShieldCheck />
            </div>
            <h3>Secure & Private</h3>
            <p>JWT authentication, role-based access, and encrypted data storage.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
              <HiOutlineMail />
            </div>
            <h3>Email Notifications</h3>
            <p>Get notified via email about shortlisting, interviews, and updates.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join hundreds of professionals who found their dream job through TalentFlow</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
            <Link to="/jobs" className="btn btn-glass btn-lg">View Open Positions</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <HiOutlineBriefcase className="footer-icon" />
            <span>TalentFlow ATS</span>
          </div>
          <p className="footer-text">Multi-Branch Recruitment & Applicant Tracking System</p>
          <p className="footer-copyright">© 2024 TalentFlow. Built with React, Node.js, MongoDB</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

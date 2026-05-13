import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineMail } from 'react-icons/hi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSuccess(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>
          
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '16px' }}>✓</div>
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>Email Sent</h3>
              <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Link to="/login" className="btn btn-outline btn-block">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <HiOutlineMail className="input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <span className="btn-loader"></span> : 'Send Reset Link'}
              </button>
            </form>
          )}
          
          <div className="auth-footer">
            <p>Remember your password? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

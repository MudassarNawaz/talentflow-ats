import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBriefcase, HiOutlineUser, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'candidate') return '/candidate/dashboard';
    return '/admin/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-icon">
            <HiOutlineBriefcase />
          </div>
          <span className="brand-text">TalentFlow</span>
          <span className="brand-badge">ATS</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/jobs" className="nav-link" onClick={() => setMenuOpen(false)}>Careers</Link>
          
          {user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <div className="nav-user">
                <div className="nav-user-avatar">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} />
                  ) : (
                    <HiOutlineUser />
                  )}
                </div>
                <span className="nav-user-name">{user.name}</span>
                <span className="nav-user-role">{user.role}</span>
                <button className="nav-logout-btn" onClick={handleLogout} title="Logout">
                  <HiOutlineLogout />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link nav-link-primary" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

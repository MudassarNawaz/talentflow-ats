import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, branchesAPI } from '../services/api';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', branch: '', type: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadBranches = async () => {
    try {
      const { data } = await branchesAPI.getAll();
      setBranches(data.branches);
    } catch (err) { console.error(err); }
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.branch) params.branch = filters.branch;
      if (filters.type) params.type = filters.type;
      params.page = filters.page;
      params.limit = 9;

      const { data } = await jobsAPI.getAll(params);
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatSalary = (salary) => {
    if (!salary?.min && !salary?.max) return 'Competitive';
    const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n;
    if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)} ${salary.currency || 'PKR'}`;
    if (salary.min) return `From ${fmt(salary.min)} ${salary.currency || 'PKR'}`;
    return `Up to ${fmt(salary.max)} ${salary.currency || 'PKR'}`;
  };

  const typeColors = {
    'Full-Time': '#6366f1', 'Part-Time': '#f59e0b', 'Contract': '#ef4444',
    'Internship': '#10b981', 'Remote': '#06b6d4',
  };

  return (
    <div className="jobs-page">
      <div className="jobs-hero">
        <h1>Find Your Next <span className="gradient-text">Opportunity</span></h1>
        <p>Explore open positions across all our branches</p>
      </div>

      {/* Filters */}
      <div className="jobs-filters">
        <div className="filter-search">
          <HiOutlineSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Search by title, department..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <select value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value, page: 1 })}>
          <option value="">All Branches</option>
          {branches.map(b => <option key={b._id} value={b._id}>{b.name} — {b.city}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="loading-screen"><div className="loader"></div></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <HiOutlineBriefcase className="empty-icon" />
          <h3>No jobs found</h3>
          <p>Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
                <div className="job-card-header">
                  <span className="job-type" style={{ background: typeColors[job.type] || '#6366f1' }}>{job.type}</span>
                  <span className="job-seats">{job.seats} {job.seats === 1 ? 'seat' : 'seats'}</span>
                </div>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-department">{job.department}</p>
                <div className="job-meta">
                  <span><HiOutlineLocationMarker /> {job.branch?.name || 'N/A'}</span>
                  <span><HiOutlineCurrencyDollar /> {formatSalary(job.salary)}</span>
                </div>
                <div className="job-meta">
                  <span><HiOutlineBriefcase /> {job.experience}</span>
                  <span><HiOutlineClock /> {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="job-description">{job.description?.substring(0, 120)}...</p>
                <div className="job-tags">
                  {job.requirements?.slice(0, 3).map((req, i) => (
                    <span key={i} className="job-tag">{req}</span>
                  ))}
                  {job.requirements?.length > 3 && <span className="job-tag">+{job.requirements.length - 3}</span>}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page <= 1}
                className="btn btn-outline btn-sm"
              >
                <HiOutlineChevronLeft /> Prev
              </button>
              <span className="pagination-info">Page {filters.page} of {totalPages}</span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= totalPages}
                className="btn btn-outline btn-sm"
              >
                Next <HiOutlineChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;

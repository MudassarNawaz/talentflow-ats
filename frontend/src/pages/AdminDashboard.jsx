import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI, interviewsAPI, branchesAPI, emailAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineCalendar, HiOutlineOfficeBuilding, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineMail, HiOutlineEye, HiOutlineChartBar, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [branches, setBranches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [filterJob, setFilterJob] = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [j, a, i, b, s] = await Promise.all([
        jobsAPI.getAll({ limit: 100 }), applicationsAPI.getAll({}),
        interviewsAPI.getAll({}), branchesAPI.getAll(),
        jobsAPI.getStats().catch(() => ({ data: { stats: null } }))
      ]);
      setJobs(j.data.jobs); setApplications(a.data.applications);
      setInterviews(i.data.interviews); setBranches(b.data.branches);
      setStats(s.data.stats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Job CRUD
  const openJobForm = (job = null) => {
    setFormData(job ? { ...job, branch: job.branch?._id || job.branch, requirements: job.requirements?.join(', ') || '', salaryMin: job.salary?.min || '', salaryMax: job.salary?.max || '' } : { title:'', description:'', department:'', branch:'', seats:1, requirements:'', salaryMin:'', salaryMax:'', type:'Full-Time', experience:'Entry Level', status:'Open' });
    setModal(job ? 'editJob' : 'addJob');
  };

  const saveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, salary: { min: Number(formData.salaryMin), max: Number(formData.salaryMax), currency: 'PKR' } };
      delete payload.salaryMin; delete payload.salaryMax;
      if (modal === 'editJob') await jobsAPI.update(formData._id, payload);
      else await jobsAPI.create(payload);
      toast.success(modal === 'editJob' ? 'Job updated!' : 'Job created!');
      setModal(null); loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job and all applications?')) return;
    try { await jobsAPI.delete(id); toast.success('Deleted'); loadAll(); }
    catch (err) { toast.error('Failed'); }
  };

  // Application status
  const updateStatus = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, { status });
      toast.success(`Status → ${status}`);
      loadAll();
    } catch (err) { toast.error('Failed'); }
  };

  // Interview
  const openInterviewForm = (app) => {
    setFormData({ applicationId: app._id, candidateName: app.candidate?.name, jobTitle: app.job?.title, scheduledDate: '', scheduledTime: '', type: 'In-Person', location: '', message: '', duration: 60 });
    setModal('scheduleInterview');
  };

  const saveInterview = async (e) => {
    e.preventDefault();
    try {
      await interviewsAPI.create(formData);
      toast.success('Interview scheduled!');
      setModal(null); loadAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // Email
  const openEmailForm = (candidate) => {
    setFormData({ candidateId: candidate._id, candidateName: candidate.name, to: candidate.email, subject: '', message: '' });
    setModal('sendEmail');
  };

  const sendEmailHandler = async (e) => {
    e.preventDefault();
    try {
      await emailAPI.send(formData);
      toast.success('Email sent!');
      setModal(null);
    } catch (err) { toast.error('Email failed'); }
  };

  // Branch
  const openBranchForm = (branch = null) => {
    setFormData(branch ? { ...branch } : { name: '', city: '', address: '', phone: '' });
    setModal(branch ? 'editBranch' : 'addBranch');
  };

  const saveBranch = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'editBranch') await branchesAPI.update(formData._id, formData);
      else await branchesAPI.create(formData);
      toast.success('Branch saved!');
      setModal(null); loadAll();
    } catch (err) { toast.error('Failed'); }
  };

  const filteredApps = applications.filter(a => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterJob && a.job?._id !== filterJob) return false;
    return true;
  });

  const statusColors = { 'Submitted':'#64748b','Under Review':'#6366f1','Shortlisted':'#f59e0b','Interview Scheduled':'#06b6d4','Selected':'#10b981','Rejected':'#ef4444' };

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;

  const pieData = stats?.statusCounts ? Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Admin Dashboard 🎯</h1>
          <p>Welcome back, {user?.name} ({user?.role})</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}><HiOutlineBriefcase/></div><div className="stat-info"><span className="stat-number">{jobs.length}</span><span className="stat-label">Total Jobs</span></div></div>
        <div className="stat-card"><div className="stat-icon" style={{background:'linear-gradient(135deg,#10b981,#059669)'}}><HiOutlineUsers/></div><div className="stat-info"><span className="stat-number">{applications.length}</span><span className="stat-label">Applications</span></div></div>
        <div className="stat-card"><div className="stat-icon" style={{background:'linear-gradient(135deg,#f59e0b,#d97706)'}}><HiOutlineCalendar/></div><div className="stat-info"><span className="stat-number">{interviews.length}</span><span className="stat-label">Interviews</span></div></div>
        <div className="stat-card"><div className="stat-icon" style={{background:'linear-gradient(135deg,#06b6d4,#0891b2)'}}><HiOutlineOfficeBuilding/></div><div className="stat-info"><span className="stat-number">{branches.length}</span><span className="stat-label">Branches</span></div></div>
      </div>

      <div className="dashboard-tabs">
        {[['overview','Analytics',HiOutlineChartBar],['jobs','Jobs',HiOutlineBriefcase],['applications','Applicants',HiOutlineUsers],['interviews','Interviews',HiOutlineCalendar],['branches','Branches',HiOutlineOfficeBuilding]].map(([key,label,Icon])=>(
          <button key={key} className={`tab-btn ${tab===key?'active':''}`} onClick={()=>setTab(key)}><Icon/> {label}</button>
        ))}
      </div>

      <div className="dashboard-content">
        {/* ANALYTICS TAB */}
        {tab === 'overview' && stats && (
          <div className="analytics-grid">
            <div className="chart-card">
              <h3>Applications by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,value})=>`${name}: ${value}`}>
                  {pieData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie><Tooltip/></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Jobs by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.departmentStats}><CartesianGrid strokeDasharray="3 3" stroke="#334155"/><XAxis dataKey="_id" stroke="#94a3b8" fontSize={12}/><YAxis stroke="#94a3b8"/><Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:8}}/><Bar dataKey="count" fill="#6366f1" radius={[6,6,0,0]}/></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {tab === 'jobs' && (
          <div>
            <div className="section-header-row"><h2>Job Postings</h2><button className="btn btn-primary btn-sm" onClick={()=>openJobForm()}><HiOutlinePlus/> Add Job</button></div>
            <div className="table-container"><table className="data-table"><thead><tr><th>Title</th><th>Department</th><th>Branch</th><th>Type</th><th>Seats</th><th>Status</th><th>Apps</th><th>Actions</th></tr></thead><tbody>
              {jobs.map(job=>(
                <tr key={job._id}><td className="td-bold">{job.title}</td><td>{job.department}</td><td>{job.branch?.name}</td><td><span className="badge">{job.type}</span></td><td>{job.seats}</td><td><span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span></td><td>{job.applicationsCount}</td>
                <td className="td-actions"><button className="btn-icon" onClick={()=>openJobForm(job)}><HiOutlinePencil/></button><button className="btn-icon btn-danger" onClick={()=>deleteJob(job._id)}><HiOutlineTrash/></button></td></tr>
              ))}
            </tbody></table></div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {tab === 'applications' && (
          <div>
            <div className="section-header-row"><h2>Applicant Management</h2>
              <div className="filter-row">
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="">All Statuses</option>{['Submitted','Under Review','Shortlisted','Interview Scheduled','Selected','Rejected'].map(s=><option key={s} value={s}>{s}</option>)}</select>
                <select value={filterJob} onChange={e=>setFilterJob(e.target.value)}><option value="">All Jobs</option>{jobs.map(j=><option key={j._id} value={j._id}>{j.title}</option>)}</select>
              </div>
            </div>
            <div className="table-container"><table className="data-table"><thead><tr><th>Candidate</th><th>Job</th><th>Status</th><th>Applied</th><th>Resume</th><th>Actions</th></tr></thead><tbody>
              {filteredApps.map(app=>(
                <tr key={app._id}>
                  <td><div className="td-user"><strong>{app.candidate?.name}</strong><small>{app.candidate?.email}</small></div></td>
                  <td>{app.job?.title}<br/><small>{app.job?.branch?.name}</small></td>
                  <td><span className="status-badge" style={{background:statusColors[app.status]}}>{app.status}</span></td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>{app.resumeUrl ? <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn-icon"><HiOutlineEye/></a> : '—'}</td>
                  <td className="td-actions">
                    <select className="action-select" value={app.status} onChange={e=>updateStatus(app._id, e.target.value)}>
                      {['Submitted','Under Review','Shortlisted','Interview Scheduled','Selected','Rejected'].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    {app.status === 'Shortlisted' && <button className="btn-icon btn-success" title="Schedule Interview" onClick={()=>openInterviewForm(app)}><HiOutlineCalendar/></button>}
                    <button className="btn-icon" title="Send Email" onClick={()=>openEmailForm(app.candidate)}><HiOutlineMail/></button>
                  </td>
                </tr>
              ))}
            </tbody></table></div>
          </div>
        )}

        {/* INTERVIEWS TAB */}
        {tab === 'interviews' && (
          <div>
            <div className="section-header-row"><h2>Interview Schedule</h2></div>
            {interviews.length === 0 ? <div className="empty-state"><HiOutlineCalendar className="empty-icon"/><h3>No interviews</h3></div> : (
              <div className="table-container"><table className="data-table"><thead><tr><th>Candidate</th><th>Job</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead><tbody>
                {interviews.map(iv=>(
                  <tr key={iv._id}><td>{iv.candidate?.name}</td><td>{iv.job?.title}</td><td>{new Date(iv.scheduledDate).toLocaleDateString()}</td><td>{iv.scheduledTime}</td><td>{iv.type}</td><td><span className={`status-badge status-${iv.status.toLowerCase()}`}>{iv.status}</span></td></tr>
                ))}
              </tbody></table></div>
            )}
          </div>
        )}

        {/* BRANCHES TAB */}
        {tab === 'branches' && (
          <div>
            <div className="section-header-row"><h2>Branch Management</h2>{user?.role==='admin'&&<button className="btn btn-primary btn-sm" onClick={()=>openBranchForm()}><HiOutlinePlus/> Add Branch</button>}</div>
            <div className="branches-grid">
              {branches.map(b=>(
                <div key={b._id} className="branch-card"><h3>{b.name}</h3><p>📍 {b.city}</p>{b.address&&<p>{b.address}</p>}{b.phone&&<p>📞 {b.phone}</p>}
                  {user?.role==='admin'&&<button className="btn btn-outline btn-sm" onClick={()=>openBranchForm(b)}><HiOutlinePencil/> Edit</button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setModal(null)}><HiOutlineX/></button>

            {(modal==='addJob'||modal==='editJob') && (
              <form onSubmit={saveJob}>
                <h2>{modal==='editJob'?'Edit Job':'Create New Job'}</h2>
                <div className="form-group"><label>Title *</label><input required value={formData.title||''} onChange={e=>setFormData({...formData,title:e.target.value})}/></div>
                <div className="form-group"><label>Description *</label><textarea required rows="4" value={formData.description||''} onChange={e=>setFormData({...formData,description:e.target.value})}/></div>
                <div className="form-row">
                  <div className="form-group"><label>Department *</label><input required value={formData.department||''} onChange={e=>setFormData({...formData,department:e.target.value})}/></div>
                  <div className="form-group"><label>Branch *</label><select required value={formData.branch||''} onChange={e=>setFormData({...formData,branch:e.target.value})}><option value="">Select</option>{branches.map(b=><option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Type</label><select value={formData.type||'Full-Time'} onChange={e=>setFormData({...formData,type:e.target.value})}>{['Full-Time','Part-Time','Contract','Internship','Remote'].map(t=><option key={t}>{t}</option>)}</select></div>
                  <div className="form-group"><label>Seats</label><input type="number" min="1" value={formData.seats||1} onChange={e=>setFormData({...formData,seats:e.target.value})}/></div>
                  <div className="form-group"><label>Experience</label><input value={formData.experience||''} onChange={e=>setFormData({...formData,experience:e.target.value})}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Min Salary (PKR)</label><input type="number" value={formData.salaryMin||''} onChange={e=>setFormData({...formData,salaryMin:e.target.value})}/></div>
                  <div className="form-group"><label>Max Salary (PKR)</label><input type="number" value={formData.salaryMax||''} onChange={e=>setFormData({...formData,salaryMax:e.target.value})}/></div>
                </div>
                <div className="form-group"><label>Requirements (comma-separated)</label><input value={formData.requirements||''} onChange={e=>setFormData({...formData,requirements:e.target.value})} placeholder="React, Node.js, MongoDB"/></div>
                <div className="form-group"><label>Status</label><select value={formData.status||'Open'} onChange={e=>setFormData({...formData,status:e.target.value})}><option>Open</option><option>Closed</option><option>Draft</option></select></div>
                <button type="submit" className="btn btn-primary btn-block">Save Job</button>
              </form>
            )}

            {modal==='scheduleInterview' && (
              <form onSubmit={saveInterview}>
                <h2>Schedule Interview</h2>
                <p className="modal-subtitle">For: <strong>{formData.candidateName}</strong> — {formData.jobTitle}</p>
                <div className="form-row">
                  <div className="form-group"><label>Date *</label><input type="date" required value={formData.scheduledDate} onChange={e=>setFormData({...formData,scheduledDate:e.target.value})}/></div>
                  <div className="form-group"><label>Time *</label><input type="time" required value={formData.scheduledTime} onChange={e=>setFormData({...formData,scheduledTime:e.target.value})}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Type</label><select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})}><option>In-Person</option><option>Video Call</option><option>Phone</option></select></div>
                  <div className="form-group"><label>Duration (min)</label><input type="number" value={formData.duration} onChange={e=>setFormData({...formData,duration:e.target.value})}/></div>
                </div>
                <div className="form-group"><label>Location</label><input value={formData.location} onChange={e=>setFormData({...formData,location:e.target.value})} placeholder="Office address or meeting link"/></div>
                <div className="form-group"><label>Message to Candidate</label><textarea rows="3" value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}/></div>
                <button type="submit" className="btn btn-primary btn-block">Schedule Interview</button>
              </form>
            )}

            {modal==='sendEmail' && (
              <form onSubmit={sendEmailHandler}>
                <h2>Send Email</h2>
                <p className="modal-subtitle">To: <strong>{formData.candidateName}</strong> ({formData.to})</p>
                <div className="form-group"><label>Subject *</label><input required value={formData.subject} onChange={e=>setFormData({...formData,subject:e.target.value})}/></div>
                <div className="form-group"><label>Message *</label><textarea required rows="5" value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}/></div>
                <button type="submit" className="btn btn-primary btn-block"><HiOutlineMail/> Send Email</button>
              </form>
            )}

            {(modal==='addBranch'||modal==='editBranch') && (
              <form onSubmit={saveBranch}>
                <h2>{modal==='editBranch'?'Edit Branch':'Add Branch'}</h2>
                <div className="form-group"><label>Name *</label><input required value={formData.name||''} onChange={e=>setFormData({...formData,name:e.target.value})}/></div>
                <div className="form-group"><label>City *</label><input required value={formData.city||''} onChange={e=>setFormData({...formData,city:e.target.value})}/></div>
                <div className="form-group"><label>Address</label><input value={formData.address||''} onChange={e=>setFormData({...formData,address:e.target.value})}/></div>
                <div className="form-group"><label>Phone</label><input value={formData.phone||''} onChange={e=>setFormData({...formData,phone:e.target.value})}/></div>
                <button type="submit" className="btn btn-primary btn-block">Save Branch</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

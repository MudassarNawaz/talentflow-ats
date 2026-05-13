# TalentFlow ATS — Multi-Branch Recruitment & Applicant Tracking System

A professional full-stack web application for automating recruitment across multiple branches.

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas)
- **File Storage:** Cloudinary
- **Email:** Gmail SMTP (Nodemailer)

## Setup Instructions

### 1. Clone & Install
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment
Copy `backend/.env.example` to `backend/.env` and fill in:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Any secret string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GMAIL_USER`, `GMAIL_APP_PASSWORD`

### 3. Seed Database
```bash
cd backend
npm run seed
```

### 4. Run
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@talentflow.com | admin123 |
| HR | hr@talentflow.com | hr123456 |
| Candidate | ali@example.com | candidate123 |

## Features
- Public career portal with job search/filter
- Candidate registration, profile, resume upload (Cloudinary)
- Application tracking with status pipeline
- HR/Admin dashboard with job CRUD, applicant management
- Interview scheduling with email notifications
- Multi-branch support (Islamabad, Lahore, Karachi, Remote)
- Analytics dashboard with charts
- JWT authentication & role-based access
- Gmail SMTP email integration
- Responsive dark-mode UI

## Live Deployment
- Frontend: [Vercel URL]
- Backend: [Render URL]

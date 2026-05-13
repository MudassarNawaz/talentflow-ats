require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Branch = require('./models/Branch');
const Job = require('./models/Job');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await Job.deleteMany({});

    // Create branches
    const branches = await Branch.create([
      { name: 'Islamabad HQ', city: 'Islamabad', address: 'Blue Area, Jinnah Avenue, Islamabad', phone: '+92-51-1234567' },
      { name: 'Lahore Office', city: 'Lahore', address: 'Gulberg III, Main Boulevard, Lahore', phone: '+92-42-1234567' },
      { name: 'Karachi Office', city: 'Karachi', address: 'Clifton Block 5, Karachi', phone: '+92-21-1234567' },
      { name: 'Remote Office', city: 'Remote', address: 'Work from anywhere', phone: '+92-300-1234567' },
    ]);

    console.log('✅ Branches created');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@talentflow.com',
      password: 'admin123',
      role: 'admin',
      phone: '+92-300-0000001',
      branch: branches[0]._id,
    });

    // Create HR user
    const hr = await User.create({
      name: 'Sarah HR Manager',
      email: 'hr@talentflow.com',
      password: 'hr123456',
      role: 'hr',
      phone: '+92-300-0000002',
      branch: branches[0]._id,
    });

    // Create candidate user
    await User.create({
      name: 'Ali Ahmed',
      email: 'ali@example.com',
      password: 'candidate123',
      role: 'candidate',
      phone: '+92-300-0000003',
      headline: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      experience: '2 years of web development',
      education: 'BS Computer Science - FAST NUCES',
    });

    console.log('✅ Users created (admin/hr/candidate)');

    // Create sample jobs
    const jobsData = [
      { title: 'Senior React Developer', description: 'We are looking for an experienced React developer to join our frontend team. You will build modern web applications using React, Redux, and TypeScript.', department: 'Engineering', branch: branches[0]._id, seats: 3, requirements: ['React.js', 'TypeScript', 'Redux', 'REST APIs', '3+ years experience'], salary: { min: 150000, max: 250000 }, type: 'Full-Time', experience: 'Mid-Senior', postedBy: hr._id },
      { title: 'Backend Node.js Engineer', description: 'Join our backend team to build scalable APIs and microservices using Node.js, Express, and MongoDB.', department: 'Engineering', branch: branches[1]._id, seats: 2, requirements: ['Node.js', 'Express', 'MongoDB', 'Docker', '2+ years experience'], salary: { min: 120000, max: 200000 }, type: 'Full-Time', experience: 'Mid Level', postedBy: hr._id },
      { title: 'UI/UX Designer', description: 'Create stunning user interfaces and experiences for our web and mobile applications.', department: 'Design', branch: branches[0]._id, seats: 1, requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'], salary: { min: 100000, max: 180000 }, type: 'Full-Time', experience: 'Mid Level', postedBy: hr._id },
      { title: 'DevOps Engineer', description: 'Manage CI/CD pipelines, cloud infrastructure, and deployment processes.', department: 'Infrastructure', branch: branches[2]._id, seats: 2, requirements: ['AWS/Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'], salary: { min: 180000, max: 300000 }, type: 'Full-Time', experience: 'Senior', postedBy: hr._id },
      { title: 'QA Engineer', description: 'Ensure product quality through manual and automated testing strategies.', department: 'Quality Assurance', branch: branches[1]._id, seats: 3, requirements: ['Selenium', 'Jest', 'Cypress', 'API Testing'], salary: { min: 80000, max: 150000 }, type: 'Full-Time', experience: 'Entry Level', postedBy: hr._id },
      { title: 'Technical Content Writer', description: 'Write technical documentation, blog posts, and API guides.', department: 'Marketing', branch: branches[3]._id, seats: 1, requirements: ['Technical Writing', 'Markdown', 'API Documentation', 'English Proficiency'], salary: { min: 60000, max: 120000 }, type: 'Remote', experience: 'Entry Level', postedBy: hr._id },
      { title: 'Project Manager', description: 'Lead and manage software development projects using Agile methodologies.', department: 'Management', branch: branches[0]._id, seats: 1, requirements: ['Agile/Scrum', 'JIRA', 'Team Leadership', 'Communication'], salary: { min: 200000, max: 350000 }, type: 'Full-Time', experience: 'Senior', postedBy: hr._id },
      { title: 'Mobile App Developer (React Native)', description: 'Build cross-platform mobile applications using React Native.', department: 'Engineering', branch: branches[3]._id, seats: 2, requirements: ['React Native', 'JavaScript', 'iOS/Android', 'REST APIs'], salary: { min: 130000, max: 220000 }, type: 'Remote', experience: 'Mid Level', postedBy: hr._id },
    ];

    await Job.create(jobsData);
    console.log('✅ Jobs created');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@talentflow.com / admin123');
    console.log('   HR:    hr@talentflow.com / hr123456');
    console.log('   Candidate: ali@example.com / candidate123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

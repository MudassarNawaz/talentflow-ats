require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Branch = require('./models/Branch');

const createHR = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.log('❌ Please provide an email address. Example: node create_hr.js myemail@gmail.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User with email ${email} already exists. They are currently a: ${existingUser.role}`);
      
      if (existingUser.role !== 'hr') {
        existingUser.role = 'hr';
        await existingUser.save();
        console.log(`✅ Converted ${email} into an HR account! You can now log in with their existing password.`);
      }
      process.exit(0);
    }

    const branch = await Branch.findOne();
    
    await User.create({
      name: 'Custom HR User',
      email: email,
      password: 'password123',
      role: 'hr',
      phone: '+92-300-0000000',
      branch: branch ? branch._id : null,
    });

    console.log(`✅ HR User created successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: password123`);
    console.log(`You can now log in to the ATS using these credentials.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create HR user:', error);
    process.exit(1);
  }
};

createHR();

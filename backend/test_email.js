

async function testEmail() {
  try {
    // 1. Login as Admin
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@talentflow.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.log('Login failed:', loginData);
      return;
    }
    const token = loginData.token;
    console.log('Logged in as Admin');

    // 2. Send email
    const emailRes = await fetch('http://localhost:5000/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        to: 'nawazmudassar252@gmail.com', // use a valid test email
        subject: 'Test Email from ATS',
        message: 'This is a test message from the ATS platform.'
      })
    });
    const emailData = await emailRes.json();
    console.log('Email response:', emailData);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEmail();

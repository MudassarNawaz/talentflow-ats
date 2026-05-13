const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"TalentFlow ATS" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: html || text,
      text: text || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  shortlisted: (candidateName, jobTitle, companyName = 'TalentFlow') => ({
    subject: `🎉 Congratulations! You've been shortlisted - ${jobTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 You're Shortlisted!</h1>
        </div>
        <div style="padding: 30px; color: #e2e8f0;">
          <p style="font-size: 16px;">Dear <strong>${candidateName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">We are pleased to inform you that your application for <strong style="color: #818cf8;">${jobTitle}</strong> at ${companyName} has been shortlisted.</p>
          <p style="font-size: 15px; line-height: 1.6;">Our HR team will be in touch with you shortly regarding the next steps.</p>
          <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #a5b4fc; font-size: 14px;">📌 Keep an eye on your email for interview scheduling details.</p>
          </div>
          <p style="font-size: 14px; color: #94a3b8;">Best regards,<br/>The ${companyName} HR Team</p>
        </div>
      </div>
    `,
  }),

  interviewInvitation: (candidateName, jobTitle, date, time, message = '', companyName = 'TalentFlow') => ({
    subject: `📅 Interview Invitation - ${jobTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📅 Interview Invitation</h1>
        </div>
        <div style="padding: 30px; color: #e2e8f0;">
          <p style="font-size: 16px;">Dear <strong>${candidateName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">You have been invited for an interview for the position of <strong style="color: #34d399;">${jobTitle}</strong>.</p>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 15px;">📆 <strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0; font-size: 15px;">⏰ <strong>Time:</strong> ${time}</p>
            ${message ? `<p style="margin: 10px 0 5px; font-size: 15px;">💬 <strong>Message:</strong> ${message}</p>` : ''}
          </div>
          <p style="font-size: 14px; color: #94a3b8;">Best regards,<br/>The ${companyName} HR Team</p>
        </div>
      </div>
    `,
  }),

  rejection: (candidateName, jobTitle, companyName = 'TalentFlow') => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #475569 0%, #64748b 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
        </div>
        <div style="padding: 30px; color: #e2e8f0;">
          <p style="font-size: 16px;">Dear <strong>${candidateName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">Thank you for your interest in the <strong>${jobTitle}</strong> position at ${companyName}.</p>
          <p style="font-size: 15px; line-height: 1.6;">After careful review, we have decided to move forward with other candidates. We encourage you to apply for future openings.</p>
          <p style="font-size: 14px; color: #94a3b8;">Best regards,<br/>The ${companyName} HR Team</p>
        </div>
      </div>
    `,
  }),

  selected: (candidateName, jobTitle, companyName = 'TalentFlow') => ({
    subject: `🎊 Offer - ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎊 Congratulations!</h1>
        </div>
        <div style="padding: 30px; color: #e2e8f0;">
          <p style="font-size: 16px;">Dear <strong>${candidateName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6;">We are thrilled to inform you that you have been <strong style="color: #fbbf24;">selected</strong> for the position of <strong style="color: #fbbf24;">${jobTitle}</strong> at ${companyName}!</p>
          <p style="font-size: 15px; line-height: 1.6;">Our HR team will contact you with the offer details shortly.</p>
          <p style="font-size: 14px; color: #94a3b8;">Best regards,<br/>The ${companyName} HR Team</p>
        </div>
      </div>
    `,
  }),

  custom: (candidateName, subject, messageBody, companyName = 'TalentFlow') => ({
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${companyName} HR</h1>
        </div>
        <div style="padding: 30px; color: #e2e8f0;">
          <p style="font-size: 16px;">Dear <strong>${candidateName}</strong>,</p>
          <div style="font-size: 15px; line-height: 1.6;">${messageBody}</div>
          <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">Best regards,<br/>The ${companyName} HR Team</p>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };

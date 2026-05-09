const nodemailer = require('nodemailer');

let testAccount = null;

const sendEmail = async (options) => {
  let transporter;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'UAP Platform'} <${process.env.FROM_EMAIL || 'no-reply@uap.edu'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  if (!process.env.EMAIL_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

// Specialized Template: Assessment Graded
const sendGradingEmail = async (studentEmail, studentName, assessmentTitle, score, totalMarks, feedback) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Great news, ${studentName}!</h2>
      <p>Your assessment "<strong>${assessmentTitle}</strong>" has been graded.</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #64748b;">Your Score:</p>
        <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #0d9488;">${score} / ${totalMarks}</p>
      </div>
      ${feedback ? `<p><strong>Instructor Feedback:</strong> ${feedback}</p>` : ''}
      <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">Log in to the portal to view full details.</p>
    </div>
  `;

  await sendEmail({
    email: studentEmail,
    subject: `Assessment Graded: ${assessmentTitle}`,
    html
  });
};

// Specialized Template: New Assessment Published
const sendNewAssessmentEmail = async (emails, title, subject, dueDate) => {
  const formattedDate = new Date(dueDate).toLocaleString();
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">New Assessment Published!</h2>
      <p>A new assessment has been added to your dashboard.</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1e293b;">${title}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Subject: ${subject}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #ef4444; font-weight: bold;">Due: ${formattedDate}</p>
      </div>
      <p>Please log in to start the assessment.</p>
    </div>
  `;

  // For multi-student notification, we use BCC or loop (BCC is better for bulk)
  await sendEmail({
    email: emails,
    subject: `New Assessment: ${title}`,
    html
  });
};

// Specialized Template: OTP Verification
const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>We received a request to reset your password. Here is your One-Time Password (OTP):</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b;">${otp}</p>
      </div>
      <p>This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Your Password Reset OTP',
    html
  });
};

module.exports = { sendGradingEmail, sendNewAssessmentEmail, sendOTPEmail };

const nodemailer = require('nodemailer');

// Validate EMAIL env vars early
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ EMAIL_USER or EMAIL_PASS missing from .env. Email will fail. See server/README-EMAIL-SETUP.md');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter failed verification:', error.message);
    console.log('📋 Fix: See server/README-EMAIL-SETUP.md for Gmail App Password');
  } else {
    console.log('✅ Email transporter ready');
  }
});

const sendPaperDecisionEmail = async (paper) => {
  const author = paper.submittedBy;
  if (!author || !author.email) {
    console.log('No author email found');
    return false;
  }

  const decision = paper.status.charAt(0).toUpperCase() + paper.status.slice(1);
  const mailOptions = {
    from: `"RevMatch" <${process.env.EMAIL_USER}>`,
    to: author.email,
    subject: `Paper Decision for "${paper.title}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .decision-${paper.status} { font-size: 24px; font-weight: bold; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .accepted { background: #d4edda; color: #155724; }
          .rejected { background: #f8d7da; color: #721c24; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RevMatch Paper Decision</h1>
        </div>
        <div class="content">
          <h2>Dear ${author.name},</h2>
          <p>Your paper <strong>"${paper.title}"</strong> has received its final decision:</p>
          <div class="decision-${paper.status}">
            ${decision.toUpperCase()}
          </div>
          <p>Thank you for submitting to RevMatch. We appreciate your contribution.</p>
          <p>Best regards,<br>RevMatch Team</p>
        </div>
        <div class="footer">
          This is an automated message. Please do not reply.
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Decision email sent to ${author.email} for paper "${paper.title}" (${paper.status})`);
    return true;
  } catch (error) {
    if (error.message.includes('PLAIN') || error.message.includes('535')) {
      console.error('❌ Gmail auth failed. Use App Password! See server/README-EMAIL-SETUP.md');
    } else {
      console.error('❌ Email send failed:', error.message);
    }
    return false;
  }
};

module.exports = { sendPaperDecisionEmail };


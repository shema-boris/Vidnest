import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP service)
  // For production, use real SMTP service (Gmail, SendGrid, etc.)
  
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    // Production SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Use ethereal email for testing
    // Note: In development, you'll need to create an ethereal account
    // or use Gmail with app password for testing
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'test@ethereal.email',
        pass: process.env.SMTP_PASS || 'test',
      },
    });
  }
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.FROM_NAME || 'VidNest'} <${process.env.FROM_EMAIL || 'noreply@vidnest.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(message);

    console.log('Email sent:', info.messageId);
    
    // For development with ethereal, log preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Email could not be sent');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #4F46E5;
          margin-bottom: 10px;
        }
        h1 {
          color: #1F2937;
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          color: #4B5563;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4F46E5;
          color: #ffffff;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #4338CA;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E5E7EB;
          font-size: 14px;
          color: #6B7280;
        }
        .warning {
          background-color: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 12px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .code {
          background-color: #F3F4F6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎬 VidNest</div>
        </div>
        
        <h1>Reset Your Password</h1>
        
        <p>Hi ${userName || 'there'},</p>
        
        <p>You recently requested to reset your password for your VidNest account. Click the button below to reset it:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong> This password reset link will expire in <strong>10 minutes</strong> for your security.
        </div>
        
        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        
        <div class="footer">
          <p>Best regards,<br>The VidNest Team</p>
          <p style="font-size: 12px; color: #9CA3AF;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Reset Your Password
    
    Hi ${userName || 'there'},
    
    You recently requested to reset your password for your VidNest account.
    
    Click the link below to reset it:
    ${resetUrl}
    
    This password reset link will expire in 10 minutes for your security.
    
    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    
    Best regards,
    The VidNest Team
  `;

  await sendEmail({
    email,
    subject: 'Password Reset Request - VidNest',
    html,
    text,
  });
};

export default { sendEmail, sendPasswordResetEmail };

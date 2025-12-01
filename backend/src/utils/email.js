// src/utils/email.js
import nodemailer from 'nodemailer';

// Simple send function for emails
export const sendEmail = async (options) => {
  console.log('=== EMAIL SENDING ATTEMPT ===');
  console.log('To:', options.email);
  console.log('Subject:', options.subject);
  console.log('Environment:', process.env.NODE_ENV);
  
  try {
    // Log email configuration (without passwords)
    console.log('Email config:', {
      host: process.env.EMAIL_HOST ? 'SET' : 'NOT SET',
      port: process.env.EMAIL_PORT ? 'SET' : 'NOT SET',
      user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      from: process.env.EMAIL_FROM ? 'SET' : 'NOT SET',
    });

    // Use different configurations for development/production
    let transporterConfig;
    
    if (process.env.NODE_ENV === 'production') {
      // Production configuration - Gmail or SendGrid
      transporterConfig = {
        service: 'gmail', // or 'sendgrid'
        auth: {
          user: process.env.EMAIL_USER || process.env.GMAIL_USER,
          pass: process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      };
      
      // If using SendGrid
      if (process.env.EMAIL_HOST && process.env.EMAIL_HOST.includes('sendgrid')) {
        transporterConfig = {
          host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
          port: process.env.EMAIL_PORT || 587,
          auth: {
            user: process.env.EMAIL_USER || 'apikey',
            pass: process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY
          }
        };
      }
    } else {
      // Development configuration
      transporterConfig = {
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        auth: {
          user: process.env.EMAIL_USER || 'sylvester.dubuque@ethereal.email',
          pass: process.env.EMAIL_PASS || 'yqYJ5MghPzUpqE3Y2S'
        },
        // For testing with Ethereal
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      };
    }

    console.log('Creating transporter with config:', {
      ...transporterConfig,
      auth: { ...transporterConfig.auth, pass: '***' }
    });

    // Create transporter
    const transporter = nodemailer.createTransport(transporterConfig);

    // Test connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP connection failed:', verifyError.message);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    // Create email content with HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${options.subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #2E7D32;
            }
            .logo {
              height: 60px;
              margin-bottom: 15px;
            }
            .title {
              color: #2E7D32;
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #2E7D32;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #1B5E20;
            }
            .reset-link {
              background-color: #f0f0f0;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              word-break: break-all;
              font-family: monospace;
              font-size: 14px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Literacy Tree School</h1>
              <p>Password Reset Request</p>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>You requested a password reset for your staff account.</p>
              
              <div class="warning">
                <strong>Important:</strong> This link will expire in 10 minutes.
              </div>
              
              <div style="text-align: center;">
                <a href="${options.resetURL || options.message}" class="button">
                  Reset Your Password
                </a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="reset-link">
                ${options.resetURL || options.message}
              </div>
              
              <p>If you didn't request this password reset, please ignore this email.</p>
              
              <p>Best regards,<br>
              Literacy Tree School Management Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from Literacy Tree School Management System.</p>
              <p>Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Literacy Tree School. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Literacy Tree School" <noreply@literacytreeschool.com>`,
      to: options.email,
      subject: options.subject || 'Password Reset Request - Literacy Tree School',
      text: options.message, // Plain text version
      html: htmlContent // HTML version
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('=== EMAIL SENT SUCCESSFULLY ===');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    // Return the info for debugging
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
      response: info.response
    };
    
  } catch (error) {
    console.error('=== EMAIL SENDING FAILED ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // For Ethereal email test accounts
    if (error.code === 'EAUTH' && error.command === 'API') {
      console.error('\n=== EMAIL SETUP INSTRUCTIONS ===');
      console.error('For testing, create a free account at: https://ethereal.email/');
      console.error('Or use Gmail with app password:');
      console.error('1. Enable 2FA on your Google account');
      console.error('2. Generate app password: https://myaccount.google.com/apppasswords');
      console.error('3. Set environment variables:');
      console.error('   EMAIL_HOST=smtp.gmail.com');
      console.error('   EMAIL_PORT=587');
      console.error('   EMAIL_USER=your-email@gmail.com');
      console.error('   EMAIL_PASS=your-app-password');
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Test email function (for debugging)
export const sendTestEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body || {};
    
    const testEmail = email || 'test@example.com';
    const testSubject = subject || 'Test Email from Literacy Tree School';
    const testMessage = message || 'This is a test email to verify the email service is working.';
    
    console.log('Sending test email to:', testEmail);
    
    const result = await sendEmail({
      email: testEmail,
      subject: testSubject,
      message: testMessage,
      resetURL: 'https://example.com/reset-password?token=test-token-123'
    });
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        to: testEmail,
        previewUrl: result.previewUrl,
        messageId: result.messageId
      }
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to send test email: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Simple email sender for password reset
export const sendPasswordResetEmail = async (userEmail, resetToken, firstName = 'User') => {
  const resetURL = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  console.log('Generating password reset link:', resetURL);
  
  return sendEmail({
    email: userEmail,
    subject: 'Password Reset Request - Literacy Tree School',
    message: `You requested a password reset. Please click the following link to reset your password: ${resetURL}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    resetURL: resetURL
  });
};

export default sendEmail;
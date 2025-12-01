// src/utils/email.js - Fixed version
import nodemailer from 'nodemailer';

// Simple send function for emails
export const sendEmail = async (options) => {
  console.log('=== EMAIL SENDING START ===');
  console.log('To:', options.email);
  console.log('Subject:', options.subject);
  
  try {
    // Check for required options
    if (!options.email || !options.email.includes('@')) {
      throw new Error('Invalid email address');
    }
    
    if (!options.subject || !options.message) {
      throw new Error('Missing email subject or message');
    }

    // Determine which email service to use
    let transporterConfig;
    let isTestAccount = false;
    
    // Check if we have real email credentials
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('Using real email service:', process.env.EMAIL_HOST);
      
      transporterConfig = {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        // For development/testing
        tls: {
          rejectUnauthorized: false
        }
      };
    } else {
      // Use Ethereal test email (no configuration needed)
      console.log('No email config found, using Ethereal test service');
      isTestAccount = true;
      
      // Create a test account
      const testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal test account created:', testAccount.user);
      
      transporterConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      };
    }

    console.log('Transporter config (password hidden):', {
      ...transporterConfig,
      auth: { ...transporterConfig.auth, pass: '***' }
    });

    // Create transporter
    const transporter = nodemailer.createTransport(transporterConfig);

    // Test connection (with timeout)
    try {
      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('SMTP connection timeout')), 10000)
        )
      ]);
      console.log('✓ SMTP connection verified');
    } catch (verifyError) {
      console.error('✗ SMTP connection failed:', verifyError.message);
      throw new Error(`Email server connection failed: ${verifyError.message}`);
    }

    // Create HTML content
    const resetURL = options.resetURL || '';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2E7D32; }
            .title { color: #2E7D32; margin: 0; }
            .button { display: inline-block; padding: 10px 20px; background-color: #2E7D32; 
                     color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; 
                     font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Literacy Tree School</h1>
              <p>Password Reset Request</p>
            </div>
            
            <p>You requested a password reset for your staff account.</p>
            
            ${resetURL ? `
            <div style="text-align: center;">
              <a href="${resetURL}" class="button">Reset Your Password</a>
            </div>
            
            <p>Or copy and paste this link:</p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${resetURL}
            </div>
            ` : ''}
            
            <p>This link will expire in 10 minutes.</p>
            
            <div class="footer">
              <p>Automated message from Literacy Tree School Management System.</p>
              <p>© ${new Date().getFullYear()} Literacy Tree School</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Literacy Tree School" <noreply@literacytreeschool.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: htmlContent
    };

    console.log('Sending email...');
    
    // Send email (with timeout)
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email sending timeout')), 30000)
      )
    ]);
    
    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Get preview URL for Ethereal emails
    let previewUrl = null;
    if (isTestAccount) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('Preview URL:', previewUrl);
      }
    }
    
    console.log('=== EMAIL SENDING END ===');
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl,
      response: info.response
    };
    
  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide user-friendly error message
    let userMessage = 'Failed to send email';
    
    if (error.message.includes('timeout')) {
      userMessage = 'Email server timeout. Please try again.';
    } else if (error.message.includes('connection')) {
      userMessage = 'Cannot connect to email server. Check configuration.';
    } else if (error.message.includes('auth') || error.code === 'EAUTH') {
      userMessage = 'Email authentication failed. Check credentials.';
    } else if (error.message.includes('Invalid email')) {
      userMessage = 'Invalid email address format.';
    }
    
    throw new Error(userMessage);
  }
};

// Test email function
export const sendTestEmail = async (req, res) => {
  try {
    console.log('Test email request received');
    
    const { email = 'test@example.com' } = req.body || {};
    
    const result = await sendEmail({
      email: email,
      subject: 'Test Email from Literacy Tree School',
      message: 'This is a test email to verify the email service is working properly.',
      resetURL: 'https://example.com/reset-password?token=test-token-123'
    });
    
    const response = {
      success: true,
      message: 'Test email sent successfully',
      previewUrl: result.previewUrl,
      messageId: result.messageId
    };
    
    if (result.previewUrl) {
      response.note = 'This is a test email. View it at the preview URL.';
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: `Test email failed: ${error.message}`,
      suggestion: 'Check email configuration in environment variables'
    });
  }
};

export default sendEmail;
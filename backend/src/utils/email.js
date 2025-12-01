// src/utils/email.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  let transporter;
  
  try {
    console.log('Attempting to send email:', {
      to: options.email,
      subject: options.subject,
      hasMessage: !!options.message,
      hasResetURL: !!options.resetURL
    });

    // Check if we're in development and using Ethereal for testing
    if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || process.env.EMAIL_HOST === 'smtp.ethereal.email')) {
      console.log('Using Ethereal for email testing');
      
      // Create a test account for Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      // Create transporter with Ethereal credentials
      transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        // Add timeout configuration
        connectionTimeout: 15000, // 15 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 15000,     // 15 seconds
      });
      
      console.log('Created Ethereal test account:', testAccount.user);
    } else {
      // Determine email service based on host
      let emailConfig = {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        // Add timeout configuration
        connectionTimeout: 15000, // 15 seconds
        greetingTimeout: 10000,   // 10 seconds
        socketTimeout: 15000,     // 15 seconds
      };

      // Special configuration for common providers
      if (process.env.EMAIL_HOST?.includes('gmail.com')) {
        emailConfig.service = 'gmail';
        emailConfig.auth.type = 'OAuth2';
      } else if (process.env.EMAIL_HOST?.includes('yahoo.com')) {
        emailConfig.service = 'yahoo';
      } else if (process.env.EMAIL_HOST?.includes('outlook.com') || process.env.EMAIL_HOST?.includes('hotmail.com')) {
        emailConfig.service = 'outlook';
      }

      transporter = nodemailer.createTransporter(emailConfig);
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message, // Use HTML if provided, otherwise use text
    };

    // If using Ethereal, update from address for clarity
    if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_HOST || process.env.EMAIL_HOST === 'smtp.ethereal.email')) {
      mailOptions.from = `"Literacy Tree School" <${transporter.options.auth.user}>`;
    }

    // Verify transporter configuration before sending
    await transporter.verify();
    console.log('Transporter verified successfully');

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
    
    if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
      errorMessage = 'Email server timeout. The email service may be temporarily unavailable.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check the email configuration.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check the email credentials.';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address format.';
    }
    
    throw new Error(errorMessage);
  }
};

export default sendEmail;
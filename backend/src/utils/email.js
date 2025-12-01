// src/utils/email.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  let transporter;
  
  try {
    console.log('Attempting to send email:', {
      to: options.email,
      subject: options.subject,
      hasMessage: !!options.message,
      hasResetURL: !!options.resetURL,
      emailHost: process.env.EMAIL_HOST
    });

    // Check if we're in development or using specific email services
    if (process.env.NODE_ENV === 'development' || 
        process.env.EMAIL_HOST?.includes('ethereal.email') ||
        process.env.EMAIL_HOST?.includes('mailtrap.io')) {
      
      if (process.env.EMAIL_HOST?.includes('mailtrap.io')) {
        console.log('Using Mailtrap for email testing');
        
        // Mailtrap configuration
        transporter = nodemailer.createTransporter({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 2525,
          secure: false, // Mailtrap uses false
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          // Add timeout configuration
          connectionTimeout: 15000, // 15 seconds
          greetingTimeout: 10000,   // 10 seconds
          socketTimeout: 15000,     // 15 seconds
          debug: process.env.NODE_ENV === 'development', // Enable debug in development
        });
      } else if (process.env.EMAIL_HOST?.includes('ethereal.email')) {
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
          connectionTimeout: 15000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        });
        
        console.log('Created Ethereal test account:', testAccount.user);
      }
    } else {
      // Production email service configuration
      let emailConfig = {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      };

      // Special configuration for common providers
      if (process.env.EMAIL_HOST?.includes('gmail.com')) {
        emailConfig.service = 'gmail';
      } else if (process.env.EMAIL_HOST?.includes('yahoo.com')) {
        emailConfig.service = 'yahoo';
      } else if (process.env.EMAIL_HOST?.includes('outlook.com')) {
        emailConfig.service = 'outlook';
      }

      transporter = nodemailer.createTransporter(emailConfig);
    }

    // Verify transporter configuration before sending
    console.log('Verifying transporter configuration...');
    await transporter.verify();
    console.log('Transporter verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Literacy Tree School" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    // If using Ethereal, update from address for clarity
    if (process.env.EMAIL_HOST?.includes('ethereal.email')) {
      mailOptions.from = `"Literacy Tree School" <${transporter.options.auth.user}>`;
    }

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

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
    console.error('Email sending failed with details:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email';
    
    if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
      errorMessage = 'Email server timeout. Please try again.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Check your configuration.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Check your credentials.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Network error while connecting to email server.';
    } else if (error.message?.includes('self signed certificate')) {
      errorMessage = 'SSL certificate error. Check your email provider settings.';
    }
    
    throw new Error(errorMessage);
  }
};

export default sendEmail;
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

    // DEVELOPMENT / TESTING (Ethereal / Mailtrap)
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.EMAIL_HOST?.includes('ethereal.email') ||
      process.env.EMAIL_HOST?.includes('mailtrap.io')
    ) {
      // MAILTRAP
      if (process.env.EMAIL_HOST?.includes('mailtrap.io')) {
        console.log('Using Mailtrap for email testing');

        transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 2525,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          secure: false,
          connectionTimeout: 15000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
          debug: process.env.NODE_ENV === 'development',
        });
      }

      // ETHEREAL
      else if (process.env.EMAIL_HOST?.includes('ethereal.email')) {
        console.log('Using Ethereal for email testing');

        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
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
    }

    // PRODUCTION (GMAIL, YAHOO, OUTLOOK, CUSTOM SMTP)
    else {
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

      // SPECIAL HANDLING: GMAIL
      if (process.env.EMAIL_HOST?.includes('gmail.com')) {
        console.log('Using Gmail SMTP with App Password');

        emailConfig = {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, // full Gmail address
            pass: process.env.EMAIL_PASS, // App Password
          },
        };
      }

      transporter = nodemailer.createTransport(emailConfig);
    }

    // VERIFY CONNECTION
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

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };

  } catch (error) {
    console.error('Email sending failed with details:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });

    let errorMessage = 'Failed to send email';

    if (error.code === 'ETIMEDOUT') errorMessage = 'Email server timeout. Please try again.';
    else if (error.code === 'ECONNECTION') errorMessage = 'Could not connect to email server.';
    else if (error.code === 'EAUTH') errorMessage = 'Email authentication failed.';
    else if (error.message?.includes('self signed certificate'))
      errorMessage = 'SSL certificate error.';

    throw new Error(errorMessage);
  }
};

export default sendEmail;

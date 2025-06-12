import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

const templateDir = path.join(__dirname, '../templates');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'travelguides4u.email@gmail.com',
    pass: 'bkdm mdox sstc thzh'
  },
  debug: true
});

const loadTemplate = async (templateName: string, replacements: Record<string, string>) => {
  const templatePath = path.join(templateDir, `${templateName}.html`);
  let template = await fs.readFile(templatePath, 'utf-8');
  
  Object.entries(replacements).forEach(([key, value]) => {
    template = template.replace(`{{${key}}}`, value);
  });
  
  return template;
};

export const sendResetEmail = async (email: string, resetToken: string): Promise<void> => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const htmlContent = await loadTemplate('reset-password', { resetLink });

    const mailOptions = {
      from: 'Travel Guides 4 U ' + `<travelguides4u.email@gmail.com}>`, // Sender address
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log('[ emailService ] Password reset email sent successfully to:', email);
  } catch (error) {
    console.error('[ emailService ] Failed to send email:', {
      error,
      email
    });
    throw new Error('Failed to send password reset email');
  }
};

// Verify email configuration on startup
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('[ emailService ] SMTP connection verified');
  } catch (error) {
    console.error('[ emailService ] SMTP connection error:', {
      error,
      user: process.env.EMAIL_USER ? 'Set' : 'Not set',
      pass: process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not set'
    });
  }
};

verifyConnection();
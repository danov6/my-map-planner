import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ses = new SESClient({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const loadTemplate = async (templateName: string, replacements: Record<string, string>) => {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  let template = await fs.readFile(templatePath, 'utf-8');
  
  Object.entries(replacements).forEach(([key, value]) => {
    template = template.replace(`{{${key}}}`, value);
  });
  
  return template;
};

export const sendResetEmail = async (email: string, resetToken: string) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const htmlContent = await loadTemplate('reset-password', {
    resetLink
  });
  
  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Reset Your Password",
      },
      Body: {
        Html: {
          Data: htmlContent,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await ses.send(command);
  } catch (error) {
    console.log('Failed to send email:', error);
    throw new Error('Failed to send password reset email');
  }
};
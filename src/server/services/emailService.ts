import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export const sendResetEmail = async (email: string, resetToken: string) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
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
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>You requested to reset your password. Click the link below to set a new password:</p>
              <p style="margin: 20px 0;">
                <a href="${resetLink}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                  Reset Password
                </a>
              </p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>This link will expire in 1 hour for security reasons.</p>
            </div>
          `,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await ses.send(command);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send password reset email');
  }
};
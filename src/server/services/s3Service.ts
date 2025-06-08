import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  },
  maxAttempts: 3
});

export const uploadToS3 = async (file: Express.Multer.File, filename: string): Promise<string> => {
  try {
    console.log('[ s3Service ] Uploading file to S3:', { 
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      filename 
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return filename;
  } catch (error) {
    console.error('[ s3Service ] S3 upload error:', error);
    throw error;
  }
};
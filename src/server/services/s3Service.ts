import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `profile-pictures/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
    return fileName;
  } catch (error) {
    console.error('[ s3Service ] S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

export const getSignedImageUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
import { Request, Response } from 'express';
import { uploadToS3, getSignedImageUrl } from '../services/s3Service';

export const uploadImage = async (req: Request | any, res: Response | any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG and WebP images are allowed' 
      });
    }

    // Upload to S3
    const s3Key = await uploadToS3(req.file);
    
    // Generate signed URL
    const imageUrl = await getSignedImageUrl(s3Key);

    console.log('[ mediaController ] Image uploaded successfully:', {
      userId: req.user.userId,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      s3Key
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      key: s3Key
    });

  } catch (error) {
    console.error('[ mediaController ] Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
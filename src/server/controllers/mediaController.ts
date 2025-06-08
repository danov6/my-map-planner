import sharp from 'sharp';
import { Request, Response } from 'express';
import { uploadToS3 } from '../services/s3Service';

export const uploadImage = async (req: Request | any, res: Response | any) => {
  try {
    if (!req.user) {
      console.error('[ mediaController ] User not authenticated');
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.file) {
      console.error('[ mediaController ] No image file provided');
      return res.status(400).json({ error: 'No image file provided' });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.error('[ mediaController ] Invalid file type:', req.file.mimetype);
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG and WebP images are allowed' 
      });
    }

    const compressedImageBuffer = await sharp(req.file.buffer)
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        mozjpeg: true
      })
      .toBuffer();

    const originalSize = req.file.size;
    const compressedSize = compressedImageBuffer.length;
    const timestamp = Date.now();
    const filename = `articles/${timestamp}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}.jpg`;
    const s3Key = await uploadToS3({
      ...req.file,
      buffer: compressedImageBuffer,
      mimetype: 'image/jpeg'
    }, filename);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    console.log('[ mediaController ] Image uploaded successfully:', {
      userId: req.user.userId,
      originalSize: `${(originalSize / 1024).toFixed(2)}KB`,
      compressedSize: `${(compressedSize / 1024).toFixed(2)}KB`,
      compressionRatio: `${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`,
      fileType: 'image/jpeg',
      s3Key,
      publicUrl: imageUrl
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
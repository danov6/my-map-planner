import { Request, Response } from 'express';
import { generateTravelGuide } from '../services/openai.js';
import { GuideRequest } from '../types/guide';

export const createGuide = async (req: Request | any, res: Response | any) => {
  try {
    const { countryCode, countryName, selectedOptions } = req.body as GuideRequest;

    if (!countryCode) {
      return res.status(400).json({ 
        error: 'Missing required field', 
        details: 'The "countryCode" field is required'
      });
    }

    if (!selectedOptions || !Array.isArray(selectedOptions) || selectedOptions.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid selected options', 
        details: 'The "selectedOptions" field must be a non-empty array'
      });
    }

    const content = await generateTravelGuide(countryName, selectedOptions);
    
    res.status(200).json({
      header: `Travel Guide for ${countryName}`,
      content,
    });
  } catch (err) {
    console.log('Guide generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate guide',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};
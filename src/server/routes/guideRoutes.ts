import express, { Router, Request, Response, NextFunction } from 'express';
import { Guide } from '../../shared/types';

const router: Router = express.Router();

// interface GuideRequest {
//   countryCode: string;
//   selectedOptions: string[];
// }
router.post('/', async (req: Request | any, res: Response | any) => {
  try {
    const { countryCode, selectedOptions } = req.body;

    // Validate required properties
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

    // Example response based on request body
    const guides: Guide[] = [{
      header: `Guide for ${countryCode}`,
      content: `Guide content for selected options: ${selectedOptions.join(', ')}`
    }];

    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to generate guide',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

export default router;
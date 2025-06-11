import { Request, Response } from 'express';
import Country from '../models/CountryModel';

export const getCountry = async (req: Request | any, res: Response | any) => {
  try {
    const { countryCode } = req.params;

    if (!countryCode) {
      return res.status(400).json({ error: 'Country code is required' });
    }

    const country = await Country.findOne({ code: countryCode.toUpperCase() });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json(country);
  } catch (error) {
    console.error('[ countryController ] Error fetching country:', error);
    res.status(500).json({ 
      error: 'Failed to fetch country',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCountry = async (req: Request | any, res: Response | any) => {
  try {
    const { name, code, description, headerImageUrl, continent, cities } = req.body;

    // Validate required fields
    if (!name || !code || !description || !headerImageUrl || !continent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const country = new Country({
      name,
      code: code.toUpperCase(),
      description,
      headerImageUrl,
      continent,
      cities: cities || []
    });

    const savedCountry = await country.save();

    console.log('[ countryController ] Country created:', { code: savedCountry.code });

    res.status(201).json(savedCountry);
  } catch (error) {
    console.error('[ countryController ] Error creating country:', error);
    res.status(500).json({ 
      error: 'Failed to create country',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCountry = async (req: Request | any, res: Response | any) => {
  try {
    const { countryCode } = req.params;
    const updates = req.body;

    if (!countryCode) {
      return res.status(400).json({ error: 'Country code is required' });
    }

    const country = await Country.findOne({ code: countryCode.toUpperCase() });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Update only allowed fields
    const allowedUpdates = ['name', 'description', 'headerImageUrl', 'continent', 'cities'] as const;
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        (country as any)[field] = updates[field];
      }
    });

    const updatedCountry = await country.save();

    console.log('[ countryController ] Country updated:', { code: updatedCountry.code });

    res.json(updatedCountry);
  } catch (error) {
    console.error('[ countryController ] Error updating country:', error);
    res.status(500).json({ 
      error: 'Failed to update country',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
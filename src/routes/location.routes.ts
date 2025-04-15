import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware';
import { UserRole } from '../types/auth';
import { db } from '../config/database';
import { locations } from '../db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger';
import { locationSchema, LocationInput } from '../schemas/location.schema';
import { z } from 'zod';

const router = Router();

// Get all locations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const allLocations = await db.select().from(locations);
    res.json(allLocations);
  } catch (error) {
    logger.error('Error getting locations:', error);
    res.status(500).json({ error: 'Failed to get locations' });
  }
});

// Get location by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    logger.error('Error getting location:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

// Create location
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const locationData = locationSchema.parse(req.body);
    
    const [newLocation] = await db
      .insert(locations)
      .values({
        userId,
        ...locationData,
      })
      .returning();
    
    res.status(201).json(newLocation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    logger.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// Update location
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const locationData = locationSchema.parse(req.body);
    
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    if (location.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this location' });
    }
    
    const [updatedLocation] = await db
      .update(locations)
      .set(locationData)
      .where(eq(locations.id, id))
      .returning();
    
    res.json(updatedLocation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    logger.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Delete location (only for admins)
router.delete('/:id', authenticateToken, authorizeRole([UserRole.ADMIN]), async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deletedLocation] = await db
      .delete(locations)
      .where(eq(locations.id, id))
      .returning();
    
    if (!deletedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    logger.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

export const locationRoutes = router; 
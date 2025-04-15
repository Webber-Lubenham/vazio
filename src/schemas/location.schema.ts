import { z } from 'zod';

export const locationSchema = z.object({
  latitude: z.string().min(1, 'Latitude é obrigatória'),
  longitude: z.string().min(1, 'Longitude é obrigatória'),
  accuracy: z.string().optional(),
  speed: z.string().optional(),
  heading: z.string().optional(),
  altitude: z.string().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>; 
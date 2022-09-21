import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  size: z.number().positive(),
  unit: z.string().min(1),
});
export const updateProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  size: z.number().positive(),
  unit: z.string().min(1),
});
export const deleteProductSchema = z.object({
  id: z.string(),
});

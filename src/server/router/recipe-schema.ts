import { z } from 'zod';

export const createRecipeSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().positive(),
    })
  ),
});
export const updateRecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
    })
  ),
});
export const deleteRecipeSchema = z.object({
  id: z.string(),
});

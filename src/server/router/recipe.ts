import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const createRecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export const recipeRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    return next();
  })
  .query('list-your-recipes', {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;
      const recipes = await ctx.prisma.recipe.findMany({
        where: { userId: userId },
        include: { Recipe_Ingredient: { include: { ingredient: true } } },
      });
      return recipes;
    },
  })
  .mutation('create-recipe', {
    input: createRecipeSchema,
    async resolve({ ctx, input }) {
      const { name, description, price } = input;
      const user = ctx.session?.user;

      console.log('input?', input);

      try {
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  });

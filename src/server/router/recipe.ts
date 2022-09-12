import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const createRecipeSchema = z.object({
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
      const user = ctx?.session?.user;
      const userId = user?.id;
      const allProducts = await ctx.prisma.product.findMany({
        where: { userId: userId },
      });

      const productsMap = new Map(allProducts.map((key) => [key.name, key.id]));

      const recipeProducts = input.ingredients.map((i) => {
        return { name: i.name, quantity: i.quantity };
      });

      console.log('input?', input);
      console.log(productsMap);
      console.log(recipeProducts);

      try {
        if (!userId) return;
        return ctx.prisma.recipe.create({
          data: {
            name: name,
            price: price,
            description: description,
            userId: userId,
            Recipe_Ingredient: {
              create: recipeProducts?.map((p) => ({
                ingredientQuantity: p.quantity,
                ingredient: {
                  connect: {
                    id: productsMap.get(p.name),
                  },
                },
              })),
            },
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  });

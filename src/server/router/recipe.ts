import { createRouter } from './context';
import { TRPCError } from '@trpc/server';

import {
  createRecipeSchema,
  deleteRecipeSchema,
  updateRecipeSchema,
} from './recipe-schema';

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
      console.log('in');
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
      console.log('products', productsMap);
      console.log('recipe', recipeProducts);

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
  })
  .mutation('update-recipe', {
    input: updateRecipeSchema,
    async resolve({ ctx, input }) {
      const { id, name, description, price } = input;
      const user = ctx?.session?.user;
      const userId = user?.id;
      const allProducts = await ctx.prisma.product.findMany({
        where: { userId: userId },
      });

      const productsMap = new Map(allProducts.map((key) => [key.name, key.id]));

      const recipeProducts = input.ingredients.map((i) => {
        return { name: i.name, quantity: i.quantity };
      });
      try {
        if (!user) return;
        return ctx.prisma.recipe.update({
          where: {
            id: id,
          },
          data: {
            name: name,
            price: price,
            description: description,
            userId: userId,
            Recipe_Ingredient: {
              deleteMany: {},
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
  })
  .mutation('delete-recipe', {
    input: deleteRecipeSchema,
    async resolve({ ctx, input }) {
      const { id } = input;

      try {
        const recipe = await ctx.prisma.recipe.delete({
          where: {
            id: id,
          },
        });
        console.log('recipe', recipe);

        const recipe_ingredient = await ctx.prisma.recipe_Ingredient.deleteMany(
          {
            where: {
              recipeId: recipe.id,
            },
          }
        );
        console.log('RI', recipe_ingredient);
        return recipe;
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  });

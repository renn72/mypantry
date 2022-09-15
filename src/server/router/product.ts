import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  size: z.number(),
  unit: z.string(),
});
export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  size: z.number(),
  unit: z.string(),
});
export const deleteProductSchema = z.object({
  id: z.string(),
});

export const productRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    return next();
  })
  .query('list-your-products', {
    async resolve({ ctx }) {
      const userId = ctx.session?.user?.id;
      const products = await ctx.prisma.product.findMany({
        where: { userId: userId },
      });

      return products.map((product) => {
        product.price = product.price / 100;
        return product;
      });
    },
  })
  .mutation('create-product', {
    input: createProductSchema,
    async resolve({ ctx, input }) {
      const { name, price, size, unit, description } = input;
      const user = ctx.session?.user;

      try {
        if (!user) return;
        return ctx.prisma.product.create({
          data: {
            name,
            price,
            size,
            unit,
            description,
            userId: user?.id,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  })
  .mutation('update-product', {
    input: updateProductSchema,
    async resolve({ ctx, input }) {
      const { name, price, size, unit, description, id } = input;
      const user = ctx.session?.user;

      try {
        if (!user) return;
        return ctx.prisma.product.updateMany({
          where: {
            id: id,
            userId: user.id,
          },
          data: {
            name: name,
            description: description,
            price: price * 100,
            size: size,
            unit: unit,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  })
  .mutation('delete-product', {
    input: deleteProductSchema,
    async resolve({ ctx, input }) {
      const { id } = input;

      try {
        const product = await ctx.prisma.product.delete({
          where: {
            id: id,
          },
        });
        console.log('products', product);

        const recipe_ingredient = await ctx.prisma.recipe_Ingredient.deleteMany(
          {
            where: {
              ingredientId: product.id,
            },
          }
        );
        return product;
        // const recipeIngredients = ctx.prisma.product.update()
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }
    },
  });

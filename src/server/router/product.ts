import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from "@trpc/server";


export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  size: z.number(),
  unit: z.string(),
});

export const productRouter = createRouter()
.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
    return next();
  })
  .query('list-your-products', {
    async resolve({ ctx  }) {
      const userId = ctx.session?.user?.id
      const products = await ctx.prisma.product.findMany({
        where: { userId : userId}
    });
      
      return products
    },
  }).mutation('create-product', {
    input: createProductSchema,
    async resolve ({ctx, input}) {
      const {name, price, size, unit, description} = input
      const user = ctx.session?.user
    

      try {
      if (!user) return
      return ctx.prisma.product.create({
        data: {
          name,
          price,
          size,
          unit,
          description,
          userId: user?.id 
        }
      })

    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      })
    }
  }
});

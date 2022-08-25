import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from "@trpc/server";


export const createProductSchema = z.object({
  name: z.string()
  ,description: z.string()
  ,price: z.number()
  ,size: z.number()
  ,unit: z.string(),

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
  });

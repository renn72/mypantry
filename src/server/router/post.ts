import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from './context';

export const postRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      if (!ctx.session?.user) return [];
      return ctx.prisma.post.findMany({
        where: { userId: ctx.session?.user?.id },
      });
    },
  })
  .query('getById', {
    input: z.object({ id: z.string() }),
    async resolve({ input, ctx }) {
      const { id } = input;
      const post = await ctx.prisma.post.findUnique({
        where: { id },
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    },
  })
  .middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .mutation('create', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { user } = ctx.session!;
      const { title, content, image } = input;

      return ctx.prisma.post.create({
        data: {
          title,
          content,
          image,
          author: user?.name || '',
          createdBy: { connect: { id: user?.id } },
        },
      });
    },
  });

// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { postRouter } from './post';
import { productRouter} from './product';
/* PLOP_INJECT_EXPORT */

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('post.', postRouter)
  /* T3_SCAFFOLD_INJECT_MERGE */
  .merge('products', productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { productRouter} from './product';
/* PLOP_INJECT_EXPORT */

export const appRouter = createRouter()
  .transformer(superjson)
  /* T3_SCAFFOLD_INJECT_MERGE */
  .merge('products.', productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

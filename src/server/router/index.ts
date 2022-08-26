// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { productRouter} from './product';
import { recipeRouter } from './recipe';
/* PLOP_INJECT_EXPORT */

export const appRouter = createRouter()
  .transformer(superjson)
  /* T3_SCAFFOLD_INJECT_MERGE */
  .merge('products.', productRouter)
  .merge('recipes.', recipeRouter)

// export type definition of API
export type AppRouter = typeof appRouter;

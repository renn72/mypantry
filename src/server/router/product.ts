import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const createProductSchema = z.object({
  name: z.string()
,description: z.string()
,price: z.number()
,size: z.number()
,unit: z.string()

})

export const updateProductSchema = z.object({
  name: z.string()
,description: z.string()
,price: z.number()
,size: z.number()
,unit: z.string()

})

export const getProductSchema = z.object({
  name: z.string()
,description: z.string()
,price: z.number()
,size: z.number()
,unit: z.string()

})

export const deleteProductSchema = z.object({
  name: z.string()
,description: z.string()
,price: z.number()
,size: z.number()
,unit: z.string()

})

export const productRouter = createRouter()
  .query("list-products", {
    async resolve({ ctx, input }) {

    },
  }).query("get-product", {
    input: getProductSchema,
    async resolve({ ctx, input }) {

    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return next();
  })
  .mutation("create-product", {
    input: z.object({

    }),
    async resolve({ ctx, input }) {
      const {  } = input;

      const user = ctx.session?.user;

      try {
      
      } catch (e) {
    
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    },
  }).mutation("update-product", {
    input: updateProductSchema,
    async resolve({ ctx, input }) {
      const {  } = input;

      const user = ctx.session?.user;

      try {
      
      } catch (e) {
    
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    },
  }).mutation("delete-product", {
    input: deleteProductSchema,
    async resolve({ ctx, input }) {
      const {  } = input;

      const user = ctx.session?.user;

      try {
      
      } catch (e) {
    
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    },
  })

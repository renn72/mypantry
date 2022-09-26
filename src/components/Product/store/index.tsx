import { useMutation, useQuery, trpc } from '../../../utils/trpc';

export const useFetchProductData = () => {
  return useQuery(['products.list-your-products']);
};

export const useGetProductData = () => {
  return useQuery(['products.list-your-products']);
};

export const useCreateProductData = () => {
  const context = trpc.useContext();
  return useMutation('products.create-product', {
    onMutate: async (data) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await context.cancelQuery(['products.list-your-products']);

      // Snapshot the previous value
      const previousProducts = context.getQueryData([
        'products.list-your-products',
      ]);

      // Optimistically update to the new value
      if (previousProducts) {
        context.setQueryData(
          ['products.list-your-products'],
          [
            ...previousProducts,
            { ...data, id: '', userId: '', createdAt: new Date() },
          ]
        );
      }

      console.log('previousProducts', previousProducts);
      console.log('data', data);

      return { previousProducts };
    },
    onError: (_err, _variables, productContext) => {
      if (productContext?.previousProducts) {
        context.setQueryData(
          ['products.list-your-products'],
          productContext.previousProducts
        );
      }
    },
    onSettled() {
      context.invalidateQueries(['products.list-your-products']);
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });
};

export const useDeleteProductData = () => {
  const context = trpc.useContext();
  return useMutation('products.delete-product', {
    onMutate: async (data) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await context.cancelQuery(['products.list-your-products']);

      // Snapshot the previous value
      const previousProducts = context.getQueryData([
        'products.list-your-products',
      ]);

      // Optimistically update to the new values
      if (previousProducts) {
        const result = previousProducts.filter((p) => p.id != data.id);
        context.setQueryData(['products.list-your-products'], [...result]);
      }
      console.log('previousProducts', previousProducts);
      console.log('data', data);

      return { previousProducts };
    },
    onSettled() {
      context.invalidateQueries(['products.list-your-products']);
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });
};

export const useUpdateProductData = () => {
  const context = trpc.useContext();
  return useMutation('products.update-product', {
    onSettled() {
      context.invalidateQueries(['products.list-your-products']);
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });
};

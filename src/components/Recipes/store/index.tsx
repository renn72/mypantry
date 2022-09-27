import { useMutation, useQuery, trpc } from '../../../utils/trpc';

export const useFetchRecipeData = () => {
  return useQuery(['recipes.list-your-recipes']);
};

export const useGetRecipeData = () => {
  return useQuery(['recipes.list-your-recipes']);
};

export const useCreateRecipeData = () => {
  const context = trpc.useContext();
  return useMutation('recipes.create-recipe', {
    onSettled() {
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });
};

export const useDeleteRecipeData = () => {
  const context = trpc.useContext();
  return useMutation('recipes.delete-recipe', {
    onSettled() {
      context.invalidateQueries(['products.list-your-products']);
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });
};

export const useUpdateRecipeData = () => {
  const context = trpc.useContext();
  return useMutation('recipes.update-recipe', {
    onSettled() {
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });
};

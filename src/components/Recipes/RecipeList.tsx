import { useAtom } from 'jotai';
import React, { Dispatch, SetStateAction } from 'react';
import { productAtom } from './form';
import { Box } from '@mantine/core';
import { IconX } from '@tabler/icons';
import { useGetRecipeData } from './store';

type ProductListProps = {
  tailwind: string;
  setRecipeModelOpen: Dispatch<SetStateAction<boolean>>;
  recipeModelOpen: boolean;
};

const RecipeList = ({
  recipeModelOpen,
  setRecipeModelOpen,
  tailwind,
}: ProductListProps) => {
  const { data: recipes, isLoading: recipesLoading } = useGetRecipeData();
  //
  // FIXME: fix any type
  /* @ts-ignore */ // has type any
  const findCogs = (recipe) => {
    if (!recipe?.Recipe_Ingredient) return;
    /* @ts-ignore */ // has type any
    const cost = recipe.Recipe_Ingredient.reduce((acc, r) => {
      const qty = r.ingredientQuantity;
      const unitPrice = r.ingredient.price / r.ingredient.size / 100;
      const cog = qty * unitPrice;
      return acc + cog;
    }, 0);

    const cog = (cost / recipe.price) * 100 * 100;

    return '$' + cost.toFixed(2) + ' / ' + cog.toFixed(0) + '%';
  };

  if (recipesLoading) return <div>loading...</div>;

  return (
    <div className={tailwind}>
      {recipes?.map((recipe) => (
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
          key={recipe.id}
          className="flex justify-between rounded-lg mx-20 px-4 py-2 cursor-pointer"
          onClick={() => {
            setRecipeUpdateId(recipe.id);
            form.setValues({
              name: recipe.name,
              price: recipe.price / 100,
              description: recipe.description ? recipe.description : '',
              ingredients: recipe.Recipe_Ingredient.map((i) => {
                return {
                  quantity: i.ingredientQuantity,
                  name: i.ingredient.name,
                  cost: 1,
                  key: '',
                };
              }),
            });
            setRecipeModelOpen(true);
          }}
        >
          <div className="capitalize">{recipe.name}</div>
          <div>price: {(recipe.price / 100).toFixed(2)}</div>
          <div>{findCogs(recipe)}</div>
          <IconX
            onClick={(e) => {
              e.stopPropagation();
              deleteRecipeMutate.mutate({ id: recipe.id });
            }}
          />
        </Box>
      ))}
    </div>
  );
};

export default RecipeList;

import React from 'react';

import { useQuery, trpc } from '../../utils/trpc';

import { IconPencilPlus, IconX } from '@tabler/icons';
import {
  Button,
  Modal,
  TextInput,
  Group,
  Box,
  NumberInput,
  Textarea,
  Select,
} from '@mantine/core';

const Recipes: React.FC = () => {
  const { data: recipes } = useQuery(['recipes.list-your-recipes']);
  return (
    <div className="flex flex-col justify-between h-full justify-self-center">
      <h2 className="text-2xl font-extrabold px-4 py-8 flex-none">Recipes</h2>
      <div className="flex flex-col gap-8 my-8 flex-1">
        {recipes?.map((recipe) => (
          <div
            key={recipe.id}
            className="flex justify-between mx-20 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            <div className="capitalize">{recipe.name}</div>
            {console.log('recipe?', recipe)}
            <div>
              {recipe.Recipe_Ingredient.reduce((acc, p) => {
                return acc + p.ingredientQuantity;
              }, 0)}
            </div>
            <div className="flex gap-2">
              <IconX />
            </div>
          </div>
        ))}
      </div>
      <Button
        className="mx-auto my-16 max-w-sm flex-none"
        size="sm"
        rightIcon={<IconPencilPlus />}
        variant="filled"
        fullWidth
        radius="md"
        // onClick={() => setProductModelOpen(true)}
      ></Button>
    </div>
  );
};

export default Recipes;

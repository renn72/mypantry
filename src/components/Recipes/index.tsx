import React, { useState } from 'react';

import { useQuery, trpc } from '../../utils/trpc';

import { IconPencilPlus, IconX, IconTrashX } from '@tabler/icons';
import {
  Button,
  Modal,
  TextInput,
  Group,
  Box,
  NumberInput,
  Textarea,
  Select,
  ActionIcon,
  Text,
} from '@mantine/core';

import { useForm } from '@mantine/form';

const randomId = () => {
  return Math.random().toString();
};

const Recipes: React.FC = () => {
  const { data: recipes } = useQuery(['recipes.list-your-recipes']);
  const { data: products } = useQuery(['products.list-your-products']);

  console.log('recipes>', recipes);

  const [recipeModelOpen, setRecipeModelOpen] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      description: '',
      ingredients: [
        {
          name: '',
          quantity: 0,
          key: randomId(),
        },
      ],
    },
  });

  const fields = form.values.ingredients.map((item, index) => (
    <Group
      key={item.key}
      spacing="sm"
      position="apart"
      noWrap={true}
      className="my-4 flex"
    >
      <Select
        placeholder="ingredient"
        searchable
        size="sm"
        data={products ? products.map((p) => p.name) : []}
        {...form.getInputProps(`ingredients.${index}.name`)}
        className="shrink"
      />
      <Text>
        {
          products
            ?.filter((p) => p.name == form?.values?.ingredients[index]?.name)
            .map((p) => p.size + ' ' + p.unit)[0]
        }
      </Text>
      <Text>
        {'$' +
          products
            ?.filter((p) => p.name == form?.values?.ingredients[index]?.name)
            .map((p) => p.price)[0]
            ?.toFixed(2)}
      </Text>
      <NumberInput
        hideControls={true}
        min={0}
        {...form.getInputProps(`ingredients.${index}.quantity`)}
        className="w-10"
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem('ingredients', index)}
      >
        <IconTrashX size={16} />
      </ActionIcon>
    </Group>
  ));

  const findCogs = (recipe) => {
    if (!recipe?.Recipe_Ingredient) return;
    const cost = recipe.Recipe_Ingredient.reduce((acc, r) => {
      const qty = r.ingredientQuantity;
      const unitPrice = r.ingredient.price / r.ingredient.size / 100;
      const cog = qty * unitPrice;
      return acc + cog;
    }, 0);

    const cog = (cost / recipe.price) * 100 * 100;

    return cost + ' / ' + cog.toFixed(2) + '%';
  };

  /* @ts-ignore */ // has type any
  const handleNewRecipeForm = (values) => {
    form.reset();
    setRecipeModelOpen(false);
  };

  if (!products) return <div>loading..</div>;
  if (!recipes) return <div>loading..</div>;

  return (
    <div>
      <div>
        <div className="flex flex-col justify-between h-full justify-self-center">
          <h2 className="text-2xl font-extrabold px-4 py-8 flex-none">
            Recipes
          </h2>
          <div className="flex flex-col gap-8 my-8 flex-1">
            {recipes?.map((recipe) => (
              <div
                key={recipe.id}
                className="flex justify-between mx-20 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                <div className="capitalize">{recipe.name}</div>
                <div>price: {(recipe.price / 100).toFixed(2)}</div>
                <div>{findCogs(recipe)}</div>
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
            onClick={() => setRecipeModelOpen(true)}
          ></Button>
        </div>
        <Modal
          opened={recipeModelOpen}
          onClose={() => setRecipeModelOpen(false)}
          title="More Recipe"
          size="xl"
        >
          <Box sx={{ maxWidth: 600 }} mx="auto">
            <form
              onSubmit={form.onSubmit((values) => handleNewRecipeForm(values))}
              className="flex flex-col gap-2"
            >
              <TextInput
                aria-label="Name"
                placeholder="Recipe Name"
                {...form.getInputProps('name')}
              />
              <NumberInput
                aria-label="Price"
                min={0.01}
                precision={2}
                placeholder="10"
                hideControls
                icon={'$'}
                {...form.getInputProps('price')}
              />
              <Box sx={{ maxWidth: 600 }} mx="auto" className="w-full">
                {fields.length > 0 ? (
                  <Group mb="xs" className="my-2">
                    <Text weight={500} size="sm" sx={{ flex: 1 }}>
                      Name
                    </Text>
                    <Text weight={500} size="sm" pr={90}>
                      Size
                    </Text>
                    <Text weight={500} size="sm" pr={90}>
                      Unit Cost
                    </Text>
                    <Text weight={500} size="sm" pr={90}>
                      Quantity
                    </Text>
                  </Group>
                ) : (
                  <Text color="dimmed" align="center">
                    No one here...
                  </Text>
                )}
                {fields}
                <Group position="center" mt="md">
                  <Button
                    onClick={() =>
                      form.insertListItem('ingredients', {
                        name: '',
                        quantity: 0,
                        key: randomId(),
                      })
                    }
                  >
                    Add Ingredient
                  </Button>
                </Group>
              </Box>
              <Textarea
                aria-label="Description"
                placeholder="Recipe description"
                autosize
                minRows={2}
                {...form.getInputProps('description')}
              />

              <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Recipes;

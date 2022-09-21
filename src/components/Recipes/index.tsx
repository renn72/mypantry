import React, { useState } from 'react';

import { useQuery, useMutation, trpc } from '../../utils/trpc';

import {
  IconPencilPlus,
  IconX,
  IconCircleMinus,
  IconCirclePlus,
} from '@tabler/icons';
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
  const context = trpc.useContext();

  const { data: recipes } = useQuery(['recipes.list-your-recipes']);
  const { data: products } = useQuery(['products.list-your-products']);

  const newRecipeMutate = useMutation('recipes.create-recipe', {
    onSettled() {
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });

  const updateRecipeMutate = useMutation('recipes.update-recipe', {
    onSuccess() {
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });

  const [recipeModelOpen, setRecipeModelOpen] = useState(false);
  const [recipeUpdateId, setRecipeUpdateId] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      description: '',
      ingredients: [
        {
          name: '',
          quantity: 0,
          cost: 0,
          key: randomId(),
        },
      ],
    },
  });

  const fields = form.values.ingredients.map((item, index) => {
    let itemSizeFormat = '';
    let itemPriceFormat = '';
    let itemCost = 0;

    if (!item.key) item.key = randomId();

    if (form?.values?.ingredients[index]?.name) {
      const [itemSize, itemUnit]: (number | string)[] = products
        ?.filter((p) => p.name == form?.values?.ingredients[index]?.name)
        .map((p) => [p.size, p.unit])[0] || [0, ''];
      if (itemSize && itemUnit)
        itemSizeFormat = itemSize.toString() + itemUnit || '';
      const itemPrice =
        products
          ?.filter((p) => p.name == form?.values?.ingredients[index]?.name)
          .map((p) => p.price)[0]
          ?.toFixed(2) || '';
      itemPriceFormat = itemPrice == '' ? itemPrice : '$' + itemPrice;
      if (itemPrice && itemSize) {
        itemCost = (item?.quantity * +itemPrice) / +itemSize;
        if (form.values.ingredients[index]?.cost != itemCost)
          form.setFieldValue(`ingredients.${index}.cost`, itemCost);
      }
    }
    return (
      <div key={item.key} className="grid grid-cols-8 gap-2 my-2 items-center">
        <Select
          placeholder="ingredient"
          searchable
          size="sm"
          data={products ? products.map((p) => p.name) : []}
          {...form.getInputProps(`ingredients.${index}.name`)}
          className="col-span-2"
        />
        <Text>{itemSizeFormat}</Text>
        <Text>{itemPriceFormat}</Text>
        <NumberInput
          hideControls={true}
          min={0}
          {...form.getInputProps(`ingredients.${index}.quantity`)}
          className="col-span-2"
        />
        <Text align="center">{itemCost.toFixed(2)}</Text>
        <ActionIcon
          color="red"
          onClick={() => form.removeListItem('ingredients', index)}
        >
          <IconCircleMinus size={16} />
        </ActionIcon>
      </div>
    );
  });

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

  // FIXME: fix any type
  /* @ts-ignore */ // has type any
  const handleNewRecipeForm = (values) => {
    if (recipeUpdateId) {
      values.price = values.price * 100;
      values.id = recipeUpdateId;
      updateRecipeMutate.mutate(values);
      setRecipeUpdateId(null);
    } else {
      // newRecipeMutate.mutate(values);
    }
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
                <IconX />
              </Box>
            ))}
          </div>
          <Button
            className="mx-auto my-16 max-w-sm flex-none"
            size="sm"
            rightIcon={<IconPencilPlus />}
            variant="filled"
            fullWidth
            radius="md"
            onClick={() => {
              setRecipeUpdateId(null);
              form.reset();
              setRecipeModelOpen(true);
            }}
          ></Button>
        </div>
        <Modal
          opened={recipeModelOpen}
          onClose={() => setRecipeModelOpen(false)}
          title="More Recipe"
          size="xl"
        >
          <Box sx={{ maxWidth: 700 }} mx="auto">
            <form
              onSubmit={form.onSubmit((values) => {
                handleNewRecipeForm(values);
              })}
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
              <div className="flex flex-col w-full justify-center align-middle">
                {fields.length > 0 ? (
                  <div className="grid grid-cols-8 gap-1 my-2">
                    <Text weight={500} className="col-span-2">
                      Name
                    </Text>
                    <Text weight={500}>Size</Text>
                    <Text weight={500}>Unit Cost</Text>
                    <Text weight={500} className="col-span-2">
                      Quantity
                    </Text>
                    <Text weight={500} align="center">
                      Total
                    </Text>
                  </div>
                ) : (
                  <Text color="dimmed" align="center">
                    No one here...
                  </Text>
                )}
                {fields}
                <div className="grid grid-cols-8 gap-1 my-2">
                  <Text align="center" className="col-start-7">
                    Total
                  </Text>
                  <Text align="center" className="">
                    COGS
                  </Text>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  <Text className="col-start-7" align="center">
                    {form.values.ingredients
                      .reduce(
                        (acc, item) => acc + (item.cost ? item.cost : 0),
                        0
                      )
                      .toFixed(2)}
                  </Text>
                  <Text className="" align="center">
                    {(
                      (form.values.ingredients.reduce(
                        (acc, item) => acc + (item.cost ? item.cost : 0),
                        0
                      ) /
                        form.values.price) *
                        100 || 0
                    ).toFixed(0)}
                    %
                  </Text>
                </div>
                <ActionIcon
                  className="self-center"
                  color="blue"
                  size={48}
                  onClick={() =>
                    form.insertListItem('ingredients', {
                      name: '',
                      quantity: 0,
                      key: randomId(),
                    })
                  }
                >
                  <IconCirclePlus size={32} />
                </ActionIcon>
              </div>
              <Textarea
                aria-label="Description"
                placeholder="Recipe description"
                autosize
                minRows={2}
                {...form.getInputProps('description')}
              />

              <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
                <Button variant="subtle" onClick={() => form.reset()}>
                  Clear
                </Button>
              </Group>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Recipes;

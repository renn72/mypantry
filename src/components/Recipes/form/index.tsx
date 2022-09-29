import React, { Dispatch, SetStateAction, useEffect } from 'react';
import PropTypes from 'prop-types';
import { atom, useAtom } from 'jotai';

import {
  Button,
  TextInput,
  Group,
  NumberInput,
  Textarea,
  Select,
  Text,
  ActionIcon,
} from '@mantine/core';

import { IconCircleMinus, IconCirclePlus } from '@tabler/icons';

import { useForm, zodResolver } from '@mantine/form';

import { useCreateRecipeData, useUpdateRecipeData } from '../store';

import { createRecipeSchema } from '../../../server/router/recipe-schema';
import { useGetProductData } from '../../Product/store';

export interface Recipe {
  id: string | null;
  name: string;
  price: number;
  size: number;
  unit: string;
  description: string;
}

export const recipeAtom = atom<Recipe>({
  id: null,
  name: '',
  price: 0,
  size: 0,
  unit: '',
  description: '',
});

const randomId = () => {
  return Math.random().toString();
};

const RecipeForm = () => {
  const newRecipeMutate = useCreateRecipeData();
  const updateRecipeMutate = useUpdateRecipeData();

  const { data: products } = useGetProductData();

  const [recipeUpdate, setRecipeUpdate] = useAtom(recipeAtom);

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
    validate: zodResolver(createRecipeSchema),
    validateInputOnBlur: true,
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
          precision={2}
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
    console.log(values);
    form.reset();
  };

  return (
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
        min={0}
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
              .reduce((acc, item) => acc + (item.cost ? item.cost : 0), 0)
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
  );
};

export default RecipeForm;

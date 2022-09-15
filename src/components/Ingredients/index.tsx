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
import { useForm } from '@mantine/form';

import { IconPencilPlus, IconX } from '@tabler/icons';

import { useMutation, useQuery, trpc } from '../../utils/trpc';
import React, { useState } from 'react';

// TODO: Form validation

const Ingredients: React.FC = () => {
  const context = trpc.useContext();
  const newProductMutate = useMutation('products.create-product', {
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
    onError: (err, variables, productContext) => {
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
  const deleteProductMutate = useMutation('products.delete-product', {
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
  const updateProductMutate = useMutation('products.update-product', {
    onSettled() {
      context.invalidateQueries(['products.list-your-products']);
      context.invalidateQueries(['recipes.list-your-recipes']);
    },
  });

  const [productModelOpen, setProductModelOpen] = useState(false);
  const [productUpdateId, setProductUpdateId] = useState<string | null>(null);

  const { data: products } = useQuery(['products.list-your-products']);

  interface FormValues {
    name: string;
    price: number;
    size: number | undefined;
    unit: string;
    description: string;
  }

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      price: 0,
      size: undefined,
      unit: 'each',
      description: '',
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'please enter a name'),
      price: (value) => (value > 0 ? null : 'price must be great than zero'),
      size: (value: number | undefined) => {
        if (value == undefined || value <= 0)
          return 'size must be great than 0';
      },
    },
  });

  /* @ts-ignore */ // has type any
  const handleNewProductForm = (values) => {
    if (!form.isValid) return;
    if (productUpdateId) {
      values.id = productUpdateId;
      console.log('values?', values);
      updateProductMutate.mutate(values);
    } else {
      newProductMutate.mutate(values);
    }
    form.reset();
    setProductUpdateId(null);
    setProductModelOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between h-full justify-self-center">
        <h2 className="text-2xl font-extrabold px-4 py-8 flex-none">
          Ingredients
        </h2>
        <div className="flex flex-col gap-8 my-8 flex-1">
          {products?.map((p) => (
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
              key={p.id}
              className="flex justify-between mx-20 px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => {
                setProductUpdateId(p.id);
                // console.log('price', p.price);
                form.setValues({
                  description: p.description ? p.description : '',
                  name: p.name,
                  price: p.price,
                  size: p.size,
                  unit: p.unit,
                });
                setProductModelOpen(true);
              }}
            >
              <div className="capitalize">{p.name}</div>
              <div
                className="flex gap-2 z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProductMutate.mutate({ id: p.id });
                }}
              >
                <IconX />
              </div>
            </Box>
          ))}
        </div>
        <Button
          className="mx-20 my-16 flex-none"
          size="sm"
          rightIcon={<IconPencilPlus />}
          variant="filled"
          radius="md"
          onClick={() => {
            setProductUpdateId(null);
            form.reset();
            setProductModelOpen(true);
          }}
        ></Button>
      </div>
      <Modal
        opened={productModelOpen}
        onClose={() => setProductModelOpen(false)}
        title="More Products"
      >
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => handleNewProductForm(values))}
            className="flex flex-col gap-2"
          >
            <TextInput
              aria-label="Name"
              placeholder="Product Name"
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
            <div className="flex">
              <NumberInput
                aria-label="Size"
                placeholder="Size"
                {...form.getInputProps('size')}
              />
              <Select
                aria-label="Unit"
                searchable
                data={['each', 'ml', 'g']}
                {...form.getInputProps('unit')}
              />
            </div>
            <Textarea
              aria-label="Description"
              placeholder="Product description"
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
  );
};

export default Ingredients;

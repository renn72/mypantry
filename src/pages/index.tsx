import Head from 'next/head';
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

import { useSession } from 'next-auth/react';

import type { NextPage } from 'next';

import React from 'react';

import { useMutation, useQuery, trpc } from '../utils/trpc';
import { useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const context = trpc.useContext();
  const newProductMutate = useMutation('products.create-product', {
    onSuccess() {
      context.invalidateQueries(['products.list-your-products']);
    },
  });
  const deleteProductMutate = useMutation('products.delete-product', {
    onSuccess() {
      context.invalidateQueries(['products.list-your-products']);
    },
  });
  const updateProductMutate = useMutation('products.update-product', {
    onSuccess() {
      context.invalidateQueries(['products.list-your-products']);
    },
  });

  const [productModelOpen, setProductModelOpen] = useState(false);
  const [productUpdateId, setProductUpdateId] = useState<string | null>(null);

  const [ingredientList] = useAutoAnimate<HTMLDivElement>();

  const { data: products } = useQuery(['products.list-your-products']);
  const { data: recipes } = useQuery(['recipes.list-your-recipes']);

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
  });

  /* @ts-ignore */ // has type any
  const handleNewProductForm = (values) => {
    values.price *= 100;
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
    <>
      <Head>
        <title>mypantry - Home</title>
      </Head>

      <main className="container mx-auto ">
        {session && session.user ? (
          <div className="flex gap-6">
            <div className="container border-gray-600 border-2 min-w-300 max-w-md">
              <div className="flex flex-col justify-between h-full justify-self-center">
                <h2 className="text-2xl font-extrabold px-4 py-8 flex-none">
                  Ingredients
                </h2>
                <div
                  ref={ingredientList}
                  className="flex flex-col gap-8 my-8 flex-1"
                >
                  {products?.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between mx-20 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setProductUpdateId(p.id);
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
                      <div className="flex gap-2">
                        <IconX
                          onClick={() =>
                            deleteProductMutate.mutate({ id: p.id })
                          }
                        />
                      </div>
                    </div>
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
            </div>
            <Modal
              opened={productModelOpen}
              onClose={() => setProductModelOpen(false)}
              title="More Products"
            >
              <Box sx={{ maxWidth: 300 }} mx="auto">
                <form
                  onSubmit={form.onSubmit((values) =>
                    handleNewProductForm(values)
                  )}
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
                      data={['each', 'milliliter', 'grams', 'tons']}
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
            <div className="container border-gray-600 border-2 min-w-600 overflow-hidden">
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
                  onClick={() => setProductModelOpen(true)}
                ></Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container border-gray-600 border-2 min-w-600">
            login
          </div>
        )}
      </main>
    </>
  );
};

export default Home;

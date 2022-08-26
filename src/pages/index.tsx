import Head from 'next/head';
import Link from 'next/link';
import { Button, Modal, Container, TextInput, Group, Box, NumberInput, Textarea, Select } from '@mantine/core';
import { useForm } from '@mantine/form';

import { IconPencilPlus } from '@tabler/icons';
import { useSession } from 'next-auth/react';

import type { NextPage } from 'next';

import { useMutation, useQuery, trpc } from '../utils/trpc';
import { useState } from 'react';

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const context = trpc.useContext();
  const newProductMutate = useMutation('products.create-product', {
    onSuccess() {
      context.invalidateQueries(['products.list-your-products'])
    }
  })

  const [productModelOpen, setProductModelOpen] = useState(false)

  const { data: products } = useQuery(['products.list-your-products']);
  //  console.log('products?', products);
  const form = useForm({
    initialValues: {
      name: '',
      price: 0,
      size: '',
      unit: '',
      description: ''
    },
  });


  /* @ts-ignore */ // has type any
  const handleNewProductForm = (values) => {
    values.price *= 100
    console.log(values)
    const response = newProductMutate.mutate(values)
    console.log('response?', response)
    form.reset()
    setProductModelOpen(false)
  }


  return (
    <>
      <Head>
        <title>mypantry - Home</title>
      </Head>

      <main className="container mx-auto flex gap-6">
        <div className='container border-gray-600 border-2 min-w-300 max-w-md'>
          {session && session.user ? (
            <div className='flex flex-col gap-8 my-2'>
              {products?.map( p => (
                <div key={p.id} className='flex flex-col gap-2 border-gray-700 border-2'>
                  <div>Name: {p.name}</div>
                  <div>desc: {p.description}</div>
                </div>
              ))}
              <Button
                  size="xs"
                  rightIcon={<IconPencilPlus />}
                  variant="filled"
                  fullWidth={true}
                  onClick={() => setProductModelOpen(true)}
                >
                </Button>
                <Modal opened={productModelOpen} onClose={() => setProductModelOpen(false)} title="More Products">
                <Box sx={{ maxWidth: 300 }} mx="auto" >
                  <form onSubmit={form.onSubmit((values) => handleNewProductForm(values))} className="flex flex-col gap-2">
                    <TextInput
                      withAsterisk
                      aria-label="Name"
                      placeholder='Product Name'
                      {...form.getInputProps('name')}
                    />
                    <NumberInput
                      aria-label="Price"
                      min={0.01}
                      precision={2}
                      placeholder='10'
                      hideControls
                      {...form.getInputProps('price')}
                    />
                    <div className='flex'>
                      <NumberInput
                        aria-label="Size"
                        placeholder="Size"
                      {...form.getInputProps('size')}
                      />
                      <Select
                        withAsterisk
                        aria-label="Unit"
                        searchable
                        data={['millileter', 'grams', 'tons']}
                        {...form.getInputProps('unit')}
                      />
                    </div>
                    <Textarea
                      withAsterisk
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
          ) : (
          <div>
                login pls
              </div>
          )}
        </div>
        <div className='container border-gray-600 border-2 min-w-600'>

        </div>
      </main>
    </>
  );
};

export default Home;

import Head from 'next/head';
import Link from 'next/link';
import { Button, Modal, Container, TextInput, Checkbox, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

import { IconPencilPlus } from '@tabler/icons';
import { useSession } from 'next-auth/react';

import type { NextPage } from 'next';

import { useQuery } from '../utils/trpc';
import { useState } from 'react';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const [productModelOpen, setProductModelOpen] = useState(false)

  const { data: products } = useQuery(['products.list-your-products']);
  //  console.log('products?', products);
const form = useForm({
    initialValues: {
      name: '',
      price: '',
      size: '',
      unit: '',
      description: ''
    },
  });

  return (
    <>
      <Head>
        <title>mypantry - Home</title>
      </Head>

      <main className="container mx-auto">
        <Container className='border-gray-600 border-2 '>
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
                <Box sx={{ maxWidth: 300 }} mx="auto">
                  <form onSubmit={form.onSubmit((values) => console.log(values))}>
                    <TextInput
                      withAsterisk
                      label="Name"
                      {...form.getInputProps('name')}
                    />
                    <TextInput
                      withAsterisk
                      label="Price"
                      {...form.getInputProps('price')}
                    />
                    <TextInput
                      withAsterisk
                      label="Size"
                      {...form.getInputProps('size')}
                    />
                    <TextInput
                      withAsterisk
                      label="Unit"
                      {...form.getInputProps('unit')}
                    />
                    <TextInput
                      withAsterisk
                      label="Description"
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
        </Container>
      </main>
    </>
  );
};

export default Home;

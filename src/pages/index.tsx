import Head from 'next/head';
import Link from 'next/link';
import { Button, Modal, Container } from '@mantine/core';
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
                 stuff
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

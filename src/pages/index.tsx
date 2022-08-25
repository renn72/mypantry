import Head from 'next/head';
import Link from 'next/link';
import { Button, Loader, Skeleton, Container } from '@mantine/core';
import { IconPencilPlus } from '@tabler/icons';
import { useSession } from 'next-auth/react';

import type { NextPage } from 'next';

import { useQuery } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const { data: posts } = useQuery(['post.getAll']);

  console.log(posts);

  return (
    <>
      <Head>
        <title>mypantry - Home</title>
      </Head>

      <main className="container mx-auto">
        <Container className='border-white border-2 flex flex-col'>

        hello
        </Container>
      </main>
    </>
  );
};

export default Home;

import Head from 'next/head';

import { useSession } from 'next-auth/react';

import type { NextPage } from 'next';

import React from 'react';

import Ingredients from '../components/Ingredients';
import Recipes from '../components/Recipes';

const Home: NextPage = () => {
  const { data: session } = useSession();
  // const context = trpc.useContext();

  return (
    <>
      <Head>
        <title>mypantry - Home</title>
      </Head>

      <main className="container mx-auto ">
        {session && session.user ? (
          <div className="flex gap-6">
            <div className="container border-gray-600 border-2 min-w-300 max-w-md">
              <Ingredients />
            </div>
            <div className="container border-gray-600 border-2 min-w-600">
              <Recipes />
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

import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";

const NewProductPage: NextPage = () => {

  const { mutate, isLoading } = trpc.useMutation([
    ["create-product"]
  ]);

  function handleSubmit(values){
    mutate(values)
  }

  return (
    <div>
      <Head>
        <title>Create product</title>
        <meta name="description" content="Create a new product" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export default NewProductPage;

import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const EditProductPage: NextPage = () => {
  const router = useRouter();
  const productId = router.query.productId as string;
  const { mutate, isLoading } = trpc.useMutation([
    ["update-product"]
  ]);

  function handleSubmit(values){
    mutate({
      productId,
      ...values
      })
  }


  return (
    <>
    <div>
      <Head>
        <title>Edit product</title>
        <meta name="description" content="Edit product" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>

    </>
  );
};

export default EditProductPage;

import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { trpc } from "../../utils/trpc";

const ProductPage: NextPage = () => {
  const router = useRouter();
  const productId = router.query.productId as string;

  const { data: productData, isLoading } = trpc.useQuery([
    ["products.get-product"],
    {
      productId
    },
  ]);


  return (
    <>
    <div>
      <Head>
        <title>product</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>

    {JSON.stringify(productData)}

    </>
  );
};

export default ProductPage;

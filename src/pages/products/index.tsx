import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const ProductsPage: NextPage = () => {
  const { data: products, isLoading } = trpc.useQuery(["products.list-products"]);

  return (
    <>
    <div>
      <Head>
        <title>product</title>
        <meta name="description" content="products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>

   { products.map((product) => {
        return <li key={ product.id }>{ JSON.stringify(product) }</li>;
      })}
  </>
);
};

export default ProductsPage;

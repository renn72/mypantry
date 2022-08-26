import Head from "next/head";
import {
  Button,
  Modal,
  TextInput,
  Group,
  Box,
  NumberInput,
  Textarea,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconPencilPlus } from "@tabler/icons";
import { useSession } from "next-auth/react";

import type { NextPage } from "next";

import { useMutation, useQuery, trpc } from "../utils/trpc";
import { useState } from "react";
import { map } from "zod";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const context = trpc.useContext();
  const newProductMutate = useMutation("products.create-product", {
    onSuccess() {
      context.invalidateQueries(["products.list-your-products"]);
    },
  });

  const [productModelOpen, setProductModelOpen] = useState(false);

  const { data: products } = useQuery(["products.list-your-products"]);
  const { data: recipes } = useQuery(["recipes.list-your-recipes"]);

  console.log("recipes?", recipes);

  const form = useForm({
    initialValues: {
      name: "",
      price: 0,
      size: "",
      unit: "",
      description: "",
    },
  });

  /* @ts-ignore */ // has type any
  const handleNewProductForm = (values) => {
    values.price *= 100;
    const response = newProductMutate.mutate(values);
    form.reset();
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
              <h2 className="text-2xl font-extrabold">Ingredients</h2>
              <div className="flex flex-col gap-8 my-2">
                {products?.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-2 border-gray-700 border-2"
                  >
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
                ></Button>
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
                        {...form.getInputProps("name")}
                      />
                      <NumberInput
                        aria-label="Price"
                        min={0.01}
                        precision={2}
                        placeholder="10"
                        hideControls
                        {...form.getInputProps("price")}
                      />
                      <div className="flex">
                        <NumberInput
                          aria-label="Size"
                          placeholder="Size"
                          {...form.getInputProps("size")}
                        />
                        <Select
                          aria-label="Unit"
                          searchable
                          data={["milliliter", "grams", "tons"]}
                          {...form.getInputProps("unit")}
                        />
                      </div>
                      <Textarea
                        aria-label="Description"
                        placeholder="Product description"
                        autosize
                        minRows={2}
                        {...form.getInputProps("description")}
                      />

                      <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                      </Group>
                    </form>
                  </Box>
                </Modal>
              </div>
            </div>
            <div className="container border-gray-600 border-2 min-w-600">
              <h2 className="text-2xl font-extrabold">Recipes</h2>
              <div className="flex flex-col gap-4">
                {recipes?.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex flex-col gap-2 border-gray-800 border-2"
                  >
                    <div>name: {recipe.name}</div>
                    <div>
                      {recipe.Recipe_Ingredient.map((ingredient) => (
                        <div>
                          <div>{ingredient.ingredient.name}</div>
                          <div>{ingredient.ingredientQuantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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

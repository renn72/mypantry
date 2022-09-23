import { Button, Box, Collapse } from '@mantine/core';

import { IconPencilPlus } from '@tabler/icons';

import React, { useState } from 'react';
import { useAtom } from 'jotai';

import ProductForm, { productAtom } from './form';
import ProductList from './productList';

// TODO: Form validation on server

const Ingredients: React.FC = () => {
  const [productModelOpen, setProductModelOpen] = useState(false);
  const [productUpdate, setProductUpdate] = useAtom(productAtom);

  return (
    <div>
      <div className="flex flex-col justify-between h-full justify-self-center">
        <h2 className="text-2xl font-extrabold px-4 py-8 flex-none">
          Ingredients
        </h2>
        <ProductList
          tailwind={'flex flex-col gap-8 my-8 flex-1'}
          setProductModelOpen={setProductModelOpen}
        />
        <Button
          className="mx-20 my-16 flex-none"
          size="sm"
          rightIcon={<IconPencilPlus />}
          variant="filled"
          radius="md"
          onClick={() => {
            setProductUpdate({ ...productUpdate, id: null });
            setProductModelOpen(!productModelOpen);
          }}
        ></Button>
      </div>
      <Collapse
        in={productModelOpen}
        transitionDuration={300}
        transitionTimingFunction="ease-in"
        title="More Products"
        className="mb-16"
      >
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <ProductForm
            productModelOpen={productModelOpen}
            setProductModelOpen={setProductModelOpen}
          />
        </Box>
      </Collapse>
    </div>
  );
};

export default Ingredients;

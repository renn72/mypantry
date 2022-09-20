import React, { useState } from 'react';

import {
  useCreateProductData,
  useDeleteProductData,
  useGetProductData,
  useUpdateProductData,
} from '../store';

import {
  Button,
  TextInput,
  Group,
  NumberInput,
  Textarea,
  Select,
} from '@mantine/core';

import { z } from 'zod';
import { useZorm } from 'react-zorm';

const ProductForm = () => {
  const productData = useGetProductData();
  const newProduct = useCreateProductData();
  const deleteProduct = useDeleteProductData();
  const updateProduct = useUpdateProductData();

  const [productUpdateId, setProductUpdateId] = useState<string | null>(null);

  const handleNewProductForm = (values) => {
    if (!form.isValid) return;
    if (productUpdateId) {
      values.id = productUpdateId;
      console.log('values?', values);
      updateProduct.mutate(values);
    } else {
      newProduct.mutate(values);
    }
    form.reset();
    setProductUpdateId(null);
    setProductModelOpen(false);
  };

  return (
    <div>
      <form className="flex flex-col gap-2">
        <TextInput aria-label="Name" placeholder="Product Name" />
        <NumberInput
          aria-label="Price"
          min={0.01}
          precision={2}
          placeholder="10"
          hideControls
          icon={'$'}
        />
        <div className="flex">
          <NumberInput aria-label="Size" placeholder="Size" />
          <Select aria-label="Unit" searchable data={['each', 'ml', 'g']} />
        </div>
        <Textarea
          aria-label="Description"
          placeholder="Product description"
          autosize
          minRows={2}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </div>
  );
};

export default ProductForm;

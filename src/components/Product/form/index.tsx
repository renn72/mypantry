import React, { Dispatch, SetStateAction, useEffect } from 'react';
import PropTypes from 'prop-types';
import { atom, useAtom } from 'jotai';

import {
  Button,
  TextInput,
  Group,
  NumberInput,
  Textarea,
  Select,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import { useCreateProductData, useUpdateProductData } from '../store';

import { createProductSchema } from '../../../server/router/product-schema';

export interface Product {
  id: string | null;
  name: string;
  price: number;
  size: number;
  unit: string;
  description: string;
}

export const productAtom = atom<Product>({
  id: null,
  name: '',
  price: 0,
  size: 0,
  unit: '',
  description: '',
});

type ProductFormProps = {
  productModelOpen: boolean;
  setProductModelOpen: Dispatch<SetStateAction<boolean>>;
};

const ProductForm = ({
  productModelOpen,
  setProductModelOpen,
}: ProductFormProps) => {
  const newProduct = useCreateProductData();
  const updateProduct = useUpdateProductData();

  const [productUpdate, setProductUpdate] = useAtom(productAtom);

  interface FormValues {
    name: string;
    price: number;
    size: number | undefined;
    unit: string;
    description: string;
  }

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      price: 0,
      size: undefined,
      unit: 'each',
      description: '',
    },
    validate: zodResolver(createProductSchema),
    validateInputOnBlur: true,
  });

  /* @ts-ignore */ // has type any
  const handleNewProductForm = (values) => {
    if (!form.isValid) return;
    if (productUpdate.id) {
      values.id = productUpdate.id;
      console.log('values?', values);
      updateProduct.mutate(values);
    } else {
      newProduct.mutate(values);
    }
    form.reset();
    setProductUpdate({ ...productUpdate, id: null });
    setProductModelOpen(false);
  };

  useEffect(() => {
    if (productModelOpen === false) setTimeout(form.reset, 300);
    if (productModelOpen === true && productUpdate.id) {
      form.setValues({
        name: productUpdate.name,
        description: productUpdate.description,
        price: productUpdate.price,
        size: productUpdate.size,
        unit: productUpdate.unit,
      });
    }
  }, [productModelOpen]);

  return (
    <form
      onSubmit={form.onSubmit((values) => handleNewProductForm(values))}
      className="flex flex-col gap-2"
    >
      <TextInput
        aria-label="Name"
        placeholder="Product Name"
        {...form.getInputProps('name')}
      />
      <NumberInput
        aria-label="Price"
        precision={2}
        placeholder="10"
        hideControls
        icon={'$'}
        {...form.getInputProps('price')}
      />
      <div className="flex">
        <NumberInput
          aria-label="Size"
          placeholder="Size"
          precision={2}
          {...form.getInputProps('size')}
        />
        <Select
          aria-label="Unit"
          searchable
          data={['each', 'ml', 'g']}
          {...form.getInputProps('unit')}
        />
      </div>
      <Textarea
        aria-label="Description"
        placeholder="Product description"
        autosize
        minRows={2}
        {...form.getInputProps('description')}
      />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

ProductForm.propTypes = {
  setProductModelOpen: PropTypes.func,
};

export default ProductForm;

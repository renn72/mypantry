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

// import { z } from 'zod';
import { useZorm } from 'react-zorm';
import {
  createProductSchema,
  updateProductSchema,
} from '../../../server/router/product-schema';

const ProductForm = () => {
  const productData = useGetProductData();
  const newProduct = useCreateProductData();
  const deleteProduct = useDeleteProductData();
  const updateProduct = useUpdateProductData();

  const [productUpdateId, setProductUpdateId] = useState<string | null>(null);

  const zo = useZorm('product', createProductSchema, {
    onValidSubmit(e) {
      e.preventDefault(), alert('Form ok\n' + JSON.stringify(e.data, null, 2));
    },
  });
  const disabled = zo.validation?.success !== true;

  console.log('zorm', zo);

  // const handleNewProductForm = (values) => {
  //   if (!form.isValid) return;
  //   if (productUpdateId) {
  //     values.id = productUpdateId;
  //     console.log('values?', values);
  //     updateProduct.mutate(values);
  //   } else {
  //     newProduct.mutate(values);
  //   }
  //   form.reset();
  //   setProductUpdateId(null);
  // };

  return (
    <div>
      <form ref={zo.ref} className="flex flex-col gap-2">
        <input
          name={zo.fields.name()}
          aria-label="name"
          placeholder="Product Name"
          type="text"
          className={zo.errors.name('errored')}
        />
        {zo.errors.name((e) => (
          <div>{e.message}</div>
        ))}
        <NumberInput
          name={zo.fields.price()}
          aria-label="Price"
          // precision={2}
          placeholder="10"
          hideControls
          icon={'$'}
        />
        <div className="flex">
          <NumberInput
            name={zo.fields.size()}
            aria-label="Size"
            placeholder="Size"
          />
          <Select
            name={zo.fields.unit()}
            aria-label="Unit"
            searchable
            data={['each', 'ml', 'g']}
          />
        </div>
        <Textarea
          name={zo.fields.description()}
          aria-label="Description"
          placeholder="Product description"
          autosize
          minRows={2}
        />

        <Group position="right" mt="md">
          <Button type="submit" disabled={disabled}>
            Submit
          </Button>
        </Group>
        <pre>Validation status: {JSON.stringify(zo.validation, null, 2)}</pre>
      </form>
    </div>
  );
};

export default ProductForm;

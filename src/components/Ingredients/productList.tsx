import { useAtom } from 'jotai';
import React, { Dispatch, SetStateAction } from 'react';
import { productAtom } from './form';
import { useDeleteProductData, useGetProductData } from './store';
import { Box } from '@mantine/core';
import { IconX } from '@tabler/icons';

type ProductListProps = {
  tailwind: string;
  setProductModelOpen: Dispatch<SetStateAction<boolean>>;
};

const ProductList = ({ setProductModelOpen, tailwind }: ProductListProps) => {
  const productData = useGetProductData();
  const deleteProduct = useDeleteProductData();

  const [, setProductUpdate] = useAtom(productAtom);

  const products = productData.data;
  if (productData.isLoading) return <div>loading... </div>;

  return (
    <div className={tailwind}>
      {products?.map((p) => (
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[5]
                  : theme.colors.gray[1],
            },
          })}
          key={p.id}
          className="flex justify-between mx-20 px-4 py-2 rounded-lg cursor-pointer"
          onClick={() => {
            setProductUpdate({
              id: p.id,
              description: p.description ? p.description : '',
              name: p.name,
              price: p.price,
              size: p.size,
              unit: p.unit,
            });
            setProductModelOpen(true);
          }}
        >
          <div className="capitalize">{p.name}</div>
          <div
            className="flex gap-2 z-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteProduct.mutate({ id: p.id });
            }}
          >
            <IconX />
          </div>
        </Box>
      ))}
    </div>
  );
};

export default ProductList;

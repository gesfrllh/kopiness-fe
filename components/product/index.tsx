'use client'

import React from 'react';
import Card from '../Base/Card';
import { useProductStore } from '@/store/useProductStore';
import FormInput from '../Base/FormInput';
import FormGroup from '../Base/FormGroup';

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
  details: { age: number; city: string };
};

const Product = () => {
  const prdct = useProductStore((state) => state.products)
  const search = useProductStore((state) => state.search)
  return (
    <>
    {/* */}
    <div className='flex gap-12 flex-wrap overflow-y-auto'>
      {prdct.map((item, idx) => (
        <div key={idx}>
          <Card title={item.title} desc={item.desc} image={item.image} width={32} height={32} price={item.price}/>
        </div>
      ))}
    </div>
      {/* <Table columns={columns} data={users} /> */}
    </>
  );
};

export default Product;

'use client'

import React, { useState } from 'react';
import Card from '../Base/Card';
import { useProductStore } from '@/store/useProductStore';
// import FormInput from '../Base/FormInput';
// import FormGroup from '../Base/FormGroup';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Badge from '../Base/Badge';

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
  details: { age: number; city: string };
};

const Product = () => {
  const prdct = useProductStore((state) => state.products)
  let search = useProductStore((state) => state.search)
  const [count, setCount] = useState<number>(0)

  const addingToCart = () => {
    setCount(count + 1 )
  }

  const details = (id: number) => {
    search = id.toString()
  }
  return (
    <>
    <div className='flex items-center justify-between'>
        Product
        <div className='flex items-center '>
        
        <div>
          <Link href="/manage/product/add">Add Product</Link>
        </div>
        <div className='flex items-center'>
            <div>
              {count > 0 && <div>
                <Badge text={count} color='red'/>
                </div>}
              <Icon icon="material-symbols-light:shopping-cart-rounded" width="52" height="52" />
            </div>
        </div>
      </div>
    </div>
    <div className='flex gap-12 h-[30rem] flex-wrap overflow-y-auto'>
      {prdct.map((item, idx) => (
        <div key={idx}>
          <Card id={item.id} title={item.title} onAddToCart={addingToCart} sec_title={item.sec_title} desc={item.desc} image={item.image} width={32} height={32} price={item.price} onDetail={() => details(item.id)}/>
        </div>
      ))}
    </div>
      {/* <Table columns={columns} data={users} /> */}
    </>
  );
};

export default Product;

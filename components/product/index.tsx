'use client'

import React, { useState } from 'react';
import Card from '../Base/Card';
import { useProductStore } from '@/store/useProductStore';
// import FormInput from '../Base/FormInput';
// import FormGroup from '../Base/FormGroup';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Badge from '../Base/Badge';
import LoaderTransition from '../LoaderTransition';
import CTA from '../Base/cta';
import Pagination from '../Base/Pagination';

// type User = {
//   id: string;
//   name: string;
//   isAdmin: boolean;
//   details: { age: number; city: string };
// };

const Product = () => {
  const [loader, setLoader] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)

  const prdct = useProductStore((state) => state.products)
  let search = useProductStore((state) => state.search)

  const addingToCart = () => {
    setCount(count + 1)
  }

  const details = (id: number) => {
    search = id.toString()
  }
  return (
    <>
      <LoaderTransition onFinish={() => setLoader(true)} />
      {loader && (
        <div>
          <div>
            <CTA title='Product Cta' />
          </div>
          <div className='bg-white rounded-lg my-8 py-4 px-8'>
            <div className='flex items-center justify-between pb-4 border-b border-gray-300'>
              Product
              <div className='flex items-center '>
                <div>
                  <Link href="/manage/product/add">Add Product</Link>
                </div>
                <div className='flex items-center'>
                  <div>
                    {count > 0 && <div>
                      <Badge 
                        text={count} 
                        color='red' />
                    </div>}
                    <Icon 
                      icon="material-symbols-light:shopping-cart-rounded" 
                      width="52" 
                      height="52" />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-8'>
              <div className='flex gap-12 py-8 justify-center  flex-wrap overflow-y-auto'>
                {prdct.map((item, idx) => (
                  <div key={idx}>
                    <Card
                      id={item.id}
                      title={item.title}
                      onAddToCart={addingToCart}
                      sec_title={item.sec_title}
                      desc={item.desc}
                      image={item.image}
                      width={32}
                      height={32}
                      price={item.price}
                      onDetail={() => details(item.id)} />
                  </div>
                ))}
              </div>
              <Pagination
                page={page}
                limit={limit}
                totalData={1250}
                siblingCount={1}
                boundaryCount={1}
                onPageChange={setPage}
                onLimitChange={(newLimit) => setLimit(newLimit)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;

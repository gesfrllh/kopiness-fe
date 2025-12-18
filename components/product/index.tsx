'use client'

import React, { useEffect, useState } from 'react';
import Card from '../Base/ui/Card/Card';
import { useProductStore } from '@/store/useProductStore';
// import FormInput from '../Base/FormInput';
// import FormGroup from '../Base/FormGroup';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Badge from '../Base/Badge';
import LoaderTransition from '../LoaderTransition';
import CTA from '../Base/cta';
import Pagination from '../Base/Pagination';
import Button from '../Base/Button';
import { Modal } from '../Base/ui/Modal/Modal';
import { ModalHeader, ModalBody, ModalFooter } from '../Base/ui/Modal/ModalCompunds';
import CardRoot from '../Base/ui/Card';

const Product = () => {
  const [loader, setLoader] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [open, setOpen] = useState<boolean>(false)

  const prdct = useProductStore((state) => state.products)
  let search = useProductStore((state) => state.search)
  const { getProduct, error } = useProductStore()

  const addingToCart = () => {
    setCount(count + 1)
  }

  const details = (id: number) => {
    search = id.toString()
  }

  useEffect(() => {
    getProduct()
  }, [error])

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
              <div className='flex items-center gap-8'>
                <Button variant='outline'>
                  <Link href="/manage/product/add">Add Product</Link>
                </Button>
                <div className='flex items-center'>
                  <div className='relative cursor-pointer' onClick={() => setOpen(true)}>
                    {count > 0 && <div>
                      <Badge
                        text={count}
                        color='red' />
                    </div>}
                    <Icon
                      icon="material-symbols-light:shopping-cart-rounded"
                      width="32"
                      style={{ color: '#92400E' }}
                      height="32" />
                  </div>

                </div>
              </div>
            </div>
            <div className='flex flex-col gap-8'>
              <div className='flex gap-12 py-8 justify-center  flex-wrap overflow-y-auto'>
                {prdct.map((item, idx) => (
                  <div key={idx}>
                    <CardRoot>
                      <CardRoot.image src={item.image_url} />
                      <CardRoot.content>
                        <CardRoot.title title={item.title} subtitle={item.sec_title} />
                        <CardRoot.price value={item.price} />
                      </CardRoot.content>
                      <CardRoot.footer>
                        <Button onClick={addingToCart}>Keranjang</Button>
                        <Button onClick={() => onDetail(id)}>Detail</Button>
                      </CardRoot.footer>
                    </CardRoot>
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

          <Modal open={open} onClose={() => setOpen(false)} size='lg'>
            <ModalHeader>
              <h3 className="text-xl font-bold">Delete Product</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone
              </p>
            </ModalHeader>

            <ModalBody>
              <p>Are you sure you want to delete this product?</p>
            </ModalBody>

            <ModalFooter>
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </button>
            </ModalFooter>
          </Modal>
        </div>
      )}
    </>
  );
};

export default Product;

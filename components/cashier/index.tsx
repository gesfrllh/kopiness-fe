'use client'

import { useCashierStore } from "@/store/useCashierStore";
import React, { useEffect } from "react";
import Accordion from "../Base/ui/Accordion/Accordion";
import TextLabel from "../Base/TextLabel";
import AnimationLogin from "../animation/AnimationLogin";
import { formatCurrency } from "@/utils/general";
import { AccordionItem } from "@/types";
import { ConfirmModal } from "../Base/ui/Modal/ConfirmModal";
import Button from "../Base/Button";
import { Modal } from "../Base/ui/Modal/Modal";
import { ModalBody, ModalHeader } from "../Base/ui/Modal/ModalCompunds";
import Tooltip from "../Base/ui/Tooltip";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";

const Cashier = () => {
  const {
    getCashier,
    Cashier,
    selected,
    deleted,
    setChoosePayment,
    choosePayment,
    setDeleted,
    setOpenModal,
    setSelected,
    setSelectedPayment,
    selectedPayment,
    openModal,
    submitPayment,
    loading,
    paymentList,
    getPayment,
    removeProduct,
  } = useCashierStore()

  const total = selected.reduce(
    (sum, item) => sum + item.subTotal as number, 0
  )

  const accordionItems: AccordionItem[] = Cashier.map((trx) => {
    const subtotal = trx.items.reduce(
      (sum, i) => sum + i.subtotal,
      0
    )

    return {
      id: trx.id,
      title: trx.orderNumber,
      name: trx.items.map((item) => item.productName).join(','),
      subTotal: subtotal,
      content: (
        <div className="space-y-1">
          <div>
            {trx.items.map((item) => (
              <div key={item.productId}>
                <div className="flex border-b p-4 justify-between">
                  <div className="flex flex-col gap-2">
                    <TextLabel dot title={item.productName} size="md" />
                    <p className="font-semibold">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div>
                    <span className="px-1 text-gray-500">
                      stok: {item.stock} /</span>
                    {item.quantity}</div>
                </div>
                <div className="border-b px-4 text-end py-2 font-semibold">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

        </div>
      ),
    }
  })

  useEffect(() => {
    getCashier()
    getPayment()
  }, [])

  return (
    <>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 rounded-lg">
          <div className="p-4">
            {accordionItems.length > 0 ? (
              <div>
                <Accordion
                  items={accordionItems}
                  selectable="multiple"
                  multiple
                  value={selected}
                  onChange={setSelected}
                  deleteValue={deleted}
                  onClick={(item) => {
                    setDeleted(item)
                    setOpenModal(!!item)
                  }}
                />
              </div>
            ) : (
              <div className="w-full p-8 rounded-lg bg-colors-var shadow-[8px_6px_0px_1px_#422900] border">
                Data Tidak Tersedia
              </div>)}
          </div>
        </div>
        <div className="border m-4 md:m-0 p-4 shadow-[8px_6px_0px_1px_#422900] bg-colors-var rounded-lg overflow-auto sticky top-5 h-fit">
          <span className="text-lg font-semibold">Payment</span>
          <div className="overflow-auto max-h-[420px]">
            {selected.map((item) => item.content)}
          </div>
          <div className="py-4 flex flex-col">
            <div className="flex items-center justify-between p-2 w-full">
              <p className="text-gray-500">Total:</p>
              <p className="font-semibold">
                {formatCurrency(total)}
              </p>
            </div>
            {selectedPayment !== null ? (
              <div className="flex text-sm font-semibold p-2 justify-between items-center">
                <span>Metode Pembayaran:</span>
                <span>{selectedPayment?.name}</span>
              </div>
            ) : null}
          </div>
          {selected.length > 0 ? (
            <div className="flex gap-2 flex-col">
              <Button variant='solid' className="w-full" onClick={() => setChoosePayment(true)}>
                Choose Payment
              </Button>

              <Button variant='outline' className="w-full" onClick={submitPayment}>
                Submit
              </Button>
            </div>
          ) : null}
        </div>
      </div >

      <ConfirmModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setDeleted(null)
        }}
        onConfirm={() => {
          if (!deleted) return

          removeProduct(deleted.id)
          setOpenModal(false)
          setDeleted(null)
        }}
        title="Apakah anda yakin?"
        description={`Ingin Menghapus`}
        data={deleted?.name}
        confirmText="Hapus"
        cancelText="Batal"
      />

      <Modal open={choosePayment} onClose={() => setChoosePayment} size='lg'>
        <ModalHeader>
          <div className='flex justify-between items-center'>
            <p className='text-lg font-semibold'>Pilih Pembayaran</p>
            <div onClick={() => (setChoosePayment(false))} className='cursor-pointer'>
              <Tooltip content="Tutup">
                <Icon
                  icon="material-symbols:close-small-outline-rounded"
                  width={36}
                  height={36}
                  style={{ color: '#b63232ff' }} />
              </Tooltip>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          {Array.isArray(paymentList) && paymentList.length > 0 && (
            <div className="flex flex-col gap-2">
              {paymentList.map((item) => {
                const isSelected = selectedPayment?.id === item.id

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPayment(item)}
                    className={`
                      flex items-center gap-8 p-4 border rounded-lg cursor-pointer
                      transition
                      ${isSelected
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:bg-gray-100'}
                    `}>
                    <Image
                      src={item.logoUrl}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />

                    <p className="text-lg font-semibold">{item.name}</p>

                    {isSelected && (
                      <span className="ml-auto text-green-600 font-semibold">
                        ✓ Dipilih
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ModalBody>
      </Modal>

      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Cashier;
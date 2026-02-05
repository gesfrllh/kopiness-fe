'use client'

import { useCashierStore } from "@/store/useCashierStore";
import React, { useEffect, useState } from "react";
import Accordion from "../Base/ui/Accordion/Accordion";
import TextLabel from "../Base/TextLabel";
import AnimationLogin from "../animation/AnimationLogin";
import { formatCurrency } from "@/utils/general";
import { AccordionItem } from "@/types";
import { ConfirmModal } from "../Base/ui/Modal/ConfirmModal";
// import Button from "../Base/Button";

const Cashier = () => {
  const [selected, setSelected] = useState<AccordionItem[]>([])
  const [deleted, setDeleted] = useState<AccordionItem | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  // const [choosePayment, setChoosePayment] = useState<boolean>(false)

  const {
    getCashier,
    Cashier,
    loading,
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
          <div className="py-4 flex justify-between items-center">
            <p className="text-gray-500">Total:</p>
            <p className="font-semibold">
              {formatCurrency(total)}
            </p>
          </div>
          <div>
            {/* <Button variant='outline' className="w-full" onClick={() => setChoosePayment(true)}> */}
            {/* Submit */}
            {/* </Button> */}
          </div>
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

      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Cashier;
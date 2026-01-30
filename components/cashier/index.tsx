'use client'

import { useCashierStore } from "@/store/useCashierStore";
import React, { useEffect, useState } from "react";
import Accordion from "../Base/ui/Accordion/Accordion";
import TextLabel from "../Base/TextLabel";
import AnimationLogin from "../animation/AnimationLogin";
import { formatCurrency } from "@/utils/general";
import { AccordionItem } from "@/types";

const Cashier = () => {
  const [selected, setSelected] = useState<AccordionItem[]>([])

  const {
    getCashier,
    Cashier,
    loading
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
      title: trx.status,
      subTotal: subtotal,
      content: (
        <div className="space-y-1">
          {trx.items.map((item) => (
            <div key={item.productId}>
              <div className="flex border-b p-4 justify-between">
                <div className="flex flex-col gap-2">
                  <TextLabel dot title={item.productName} size="md" />
                  <p className="font-semibold">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div>{item.quantity}</div>
              </div>
              <div className="border-b px-4 text-end py-2 font-semibold">
                {formatCurrency(item.subtotal)}
              </div>
            </div>
          ))}
        </div>
      ),
    }
  })

  useEffect(() => {
    getCashier()
  }, [])

  return (
    <>
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3 rounded-lg">
          <div className="p-4">
            <Accordion
              items={accordionItems}
              selectable="multiple"
              title="Transaksi"
              multiple
              value={selected}
              onChange={setSelected}
            />
          </div>
        </div>
        <div className="border shadow-[8px_6px_0px_1px_#422900] bg-colors-var rounded-lg p-4 overflow-auto sticky top-5 h-fit">
          <span className="text-lg font-semibold">Payment</span>
          <div className="overflow-auto max-h-[280px]">
            {selected.map((item) => item.content)}
          </div>
          {selected.length > 0 ? (
            <div>
              {formatCurrency(total)}
            </div>
          ) : null}
        </div>
      </div >
      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Cashier;
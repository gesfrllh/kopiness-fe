'use client'

import { useCashierStore } from "@/store/useCashierStore";
import React, { useEffect } from "react";
import Accordion from "../Base/ui/Accordion/Accordion";
import { formatCurrency } from "@/utils/general";
import { AccordionItem } from "@/types";
import { ConfirmModal } from "../Base/ui/Modal/ConfirmModal";
import Button from "../Base/Button";
import { Modal } from "../Base/ui/Modal/Modal";
import { ModalBody, ModalHeader } from "../Base/ui/Modal/ModalCompunds";
import Tooltip from "../Base/ui/Tooltip";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { PageContainer, PageHeader } from "../Base/PageContainer";

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
      name: trx.items.map((item) => item.productName).join(', '),
      subTotal: subtotal,
      content: (
        <div className="divide-y divide-gray-100">
          {trx.items.map((item) => (
            <div key={item.productId} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">Stock: {item.stock}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">{item.quantity} &times; {formatCurrency(item.price)}</p>
                  <p className="text-sm font-semibold text-neutral-800">{formatCurrency(item.subtotal)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    }
  })

  useEffect(() => {
    getCashier()
    getPayment()
  }, [getCashier, getPayment])

  return (
    <PageContainer>
      <PageHeader
        title="Cashier"
        subtitle="Proses pembayaran pesanan pelanggan"
        action={
          selected.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#BD6230]/10 text-[#BD6230] text-sm font-medium">
              <Icon icon="mdi:check-circle" width={16} />
              {selected.length} pesanan dipilih
            </div>
          )
        }
      />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* LEFT: ORDER LIST */}
          <div className="lg:col-span-3">
            {accordionItems.length > 0 ? (
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
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-center py-24 space-y-4">
                  <Icon icon="mdi:receipt-off" width={64} className="mx-auto text-gray-300" />
                  <h2 className="text-xl font-semibold text-gray-500">Tidak Ada Pesanan</h2>
                  <p className="text-gray-400">Belum ada pesanan yang masuk.</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: PAYMENT SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-var rounded-2xl p-5 bg-white card-shadow">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                {/* <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>payments</span> */}
                <h3 className="font-semibold text-sm">Ringkasan Pembayaran</h3>
              </div>

              {selected.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  {/* <span className="material-symbols-outlined text-4xl mb-2" style={{ fontSize: 36 }}>point_of_sale</span> */}
                  <p className="text-xs">Pilih pesanan di samping</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-3">
                    {selected.length} pesanan dipilih:
                  </p>

                  <div className="space-y-2 max-h-64 overflow-auto mb-4">
                    {selected.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-dashed border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-neutral-700 truncate">{item.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{item.name}</p>
                        </div>
                        <span className="text-xs font-semibold text-neutral-800 ml-2">
                          {formatCurrency(item.subTotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Pesanan</span>
                      <span>{selected.length} item</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-primary pt-1 border-t border-gray-100">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {selectedPayment && (
                    <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2">
                      {selectedPayment.logoUrl && (
                        <Image src={selectedPayment.logoUrl} alt="" width={20} height={20} className="rounded" />
                      )}
                      <span className="text-xs font-medium text-amber-800">{selectedPayment.name}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="solid" className="w-full" onClick={() => setChoosePayment(true)}>
                      Pilih Pembayaran
                    </Button>
                    <Button variant="outline" className="w-full" onClick={submitPayment}>
                      Submit Pembayaran
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

      </div>

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
        description="Ingin menghapus pesanan ini?"
        data={deleted?.name}
        confirmText="Hapus"
        cancelText="Batal"
      />

      <Modal open={choosePayment} onClose={() => setChoosePayment} size="lg">
        <ModalHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Pilih Pembayaran</h3>
              <p className="text-sm text-gray-500 mt-0.5">Pilih metode pembayaran yang akan digunakan</p>
            </div>
            <div onClick={() => setChoosePayment(false)} className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition">
              <Tooltip content="Tutup">
                <Icon
                  icon="material-symbols:close-small-outline-rounded"
                  width={28}
                  height={28}
                  style={{ color: '#b63232ff' }}
                />
              </Tooltip>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          {Array.isArray(paymentList) && paymentList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentList.map((item) => {
                const isSelected = selectedPayment?.id === item.id

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPayment(item)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${isSelected
                        ? 'border-green-500 bg-green-50 shadow-sm'
                        : 'border-gray-200 hover:border-amber-300 hover:shadow-sm bg-white'}
                    `}
                  >
                    {item.logoUrl && (
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center p-1.5 shrink-0">
                        <Image
                          src={item.logoUrl}
                          alt={item.name}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800">{item.name}</p>
                    </div>

                    {isSelected && (
                      <span className="shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Icon icon="mdi:check" width={16} />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Icon icon="mdi:credit-card-off" width={48} className="mx-auto mb-3" />
              <p>Tidak ada metode pembayaran tersedia</p>
            </div>
          )}
        </ModalBody>
      </Modal>
    </PageContainer>
  )
}

export default Cashier

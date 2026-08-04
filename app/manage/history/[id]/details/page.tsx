'use client'

import AnimationLogin from "@/components/animation/AnimationLogin";
// import { getDetail, getDetailsTracking } from "@/pages/api/history/history";
import { useHistoryStore } from "@/store/useHistory";
import { StepsTracking } from "@/types/history";
// import { ItemsDetailsProduct } from "@/types/history";
import { formatCurrency } from "@/utils/general";
import React, { useEffect } from "react";
import dynamic from 'next/dynamic'

const CourierMap = dynamic(() => import('@/components/map/CourierMap'), { ssr: false })

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)

  const {
    getDetails,
    details,
    loading,
  } = useHistoryStore()
  useEffect(() => {
    void getDetails(id)
    const refreshInterval = window.setInterval(() => {
      void getDetails(id)
    }, 10_000)

    return () => window.clearInterval(refreshInterval)
  }, [getDetails, id])
  return (
    <>
      {/* <Button onClick={() => getDetailsTracking(id)}>
        Get Tracking Log
      </Button> */}
      <div className="px-4 md:px-8">
        <div className="px-4 md:px-10 py-8 space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Detail Transaksi
            </h1>
            <p className="text-sm text-gray-400">
              {details?.orderNumber}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* LEFT: MAP */}
            <div className="md:col-span-8">
              <div className="bg-white border rounded-2xl overflow-hidden">

                {/* MAP AREA */}
                <div className="h-48 md:h-[400px] bg-gray-200 relative">
                  {details?.tracking?.location && (
                    <CourierMap
                      latitude={details.tracking.location.latitude}
                      longitude={details.tracking.location.longitude}
                      destination={details.tracking.destination}
                    />
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full">
                    {details?.tracking?.location ? 'Lokasi kurir terakhir' : 'Lokasi kurir belum tersedia'}
                  </div>
                </div>

                {/* SERVICE INFO */}
                <div className="p-4 md:p-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {details?.tracking?.courier?.name ?? 'Kurir belum ditugaskan'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {details?.tracking?.location?.updatedAt
                        ? `Diperbarui ${new Date(details.tracking.location.updatedAt).toLocaleString()}`
                        : 'Belum ada pembaruan lokasi'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                      {details?.tracking?.location ? (
                        <a
                          href={`https://www.google.com/maps?q=${details.tracking.location.latitude},${details.tracking.location.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Buka lokasi kurir di Google Maps"
                        >
                          Map
                        </a>
                      ) : 'Map'}
                    </button>
                    <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                      💬
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT: TIMELINE + INFO */}
            <div className="md:col-span-4 space-y-6">

              {/* TIMELINE */}
              <div className="bg-white border rounded-2xl p-6">
                <h2 className="font-semibold mb-6 text-gray-700">
                  Service Timeline
                </h2>

                <div className="space-y-6">
                  {details?.tracking?.steps?.map((step: StepsTracking, i: number) => (
                    <div key={i} className="flex gap-4">

                      {/* DOT + LINE */}
                      <div className="flex flex-col items-center">
                        <div className={`
                w-3 h-3 rounded-full
                ${step.active ? 'bg-green-500' : 'bg-gray-300'}
              `}></div>

                        {i !== details.tracking.steps.length - 1 && (
                          <div className="w-[2px] flex-1 bg-gray-200 mt-1"></div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div>
                        <p className={`
                font-medium
                ${step.active ? 'text-gray-800' : 'text-gray-400'}
              `}>
                          {step.label}
                        </p>

                        <p className="text-sm text-gray-400">
                          {step.timestamp ? new Date(step.timestamp).toLocaleString() : '-'}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* INFO */}
              <div className="bg-white border rounded-2xl p-6 space-y-4">
                <h2 className="font-semibold text-gray-700">
                  Informasi
                </h2>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="font-medium">{details?.status}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Metode</span>
                  <span className="font-medium">
                    {details?.payment?.method || '-'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tanggal</span>
                  <span className="font-medium">
                    {details?.createdAt}
                  </span>
                </div>

                <div className="border-t"></div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {formatCurrency(details?.payment?.totalAmount || 0)}
                  </span>
                </div>
              </div>

            </div>

          </div>
          {/* PRODUCTS */}
          <div className="bg-white border rounded-xl p-6">

            <h2 className="font-semibold mb-6 text-gray-700">
              Produk
            </h2>

            {/* <div className="divide-y">
              {trackModal.entry?.items?.map((item: any, i: number) => (
                <div key={i} className="py-4 flex justify-between">

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {item.qty} x {formatCurrency(item.price)}
                    </p>
                  </div>

                  <p className="font-medium">
                    {formatCurrency(item.qty * item.price)}
                  </p>

                </div>
              ))}
            </div> */}

          </div>

        </div>
      </div>
      {loading ? <AnimationLogin /> : null}
    </>
  )
}

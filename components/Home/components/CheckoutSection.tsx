'use client'

import React from "react";
import { motion } from 'framer-motion'
import { ShoppingCart, CreditCard, Clock, AlertCircle } from 'lucide-react';
import Link from "next/link";

const CheckoutSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: <ShoppingCart className="w-6 h-6" />,
      title: 'Pilih Produk',
      description: 'Jelajahi koleksi kopi premium kami atau customize brew dengan AI'
    },
    {
      number: 2,
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Review Pesanan',
      description: 'Cek detail produk, kuantitas, dan nilai total belanja Anda'
    },
    {
      number: 3,
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Pembayaran',
      description: 'Pilih metode pembayaran dan selesaikan transaksi dengan aman'
    },
    {
      number: 4,
      icon: <Clock className="w-6 h-6" />,
      title: 'Tracking Order',
      description: 'Pantau status pesanan Anda real-time dalam history'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Mudah, Cepat & Aman</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Proses berbelanja yang sederhana dari pemilihan hingga pembayaran dan tracking pesanan
          </p>
        </motion.div>

        {/* Steps Grid - Horizontal on Desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-amber-900 text-white rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-amber-600 mb-4 mt-2">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Line (hidden on last item and mobile) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-amber-200 to-transparent"></div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Siap untuk Pengalaman Berbelanja Terbaik?
          </h3>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Jutaan pecinta kopi sudah merasakan kemudahan dan kepuasan berbelanja di Kopiness
          </p>
          <Link
            href="/manage/product"
            className="inline-block px-8 py-3 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transition-colors"
          >
            Mulai Berbelanja
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CheckoutSection;

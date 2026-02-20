'use client'

import React from "react";
import { motion } from 'framer-motion'
import { Zap, Leaf, Award, Truck } from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitsSection: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Customize',
      description: 'Customize brew Anda dalam hitungan detik dengan AI yang cerdas dan responsif'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Biji Kopi Berkualitas',
      description: 'Setiap biji dipilih dari perkebunan terbaik dengan standar kualitas tertinggi'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Guaranteed Satisfaction',
      description: 'Kepuasan Anda adalah prioritas kami dengan jaminan kualitas 100%'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Order Tracking',
      description: 'Pantau setiap pesanan Anda secara real-time dari checkout hingga tiba'
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Mengapa Memilih Kopiness?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami berkomitmen untuk memberikan pengalaman kopi terbaik dengan layanan yang luar biasa
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-2">
                {/* Icon */}
                <div className="text-amber-900 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-900 transition-colors">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-amber-900 to-amber-700 rounded-2xl p-12 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Menikmati Kopi Terbaik?
          </h3>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto text-lg">
            Bergabunglah dengan ribuan pelanggan yang telah merasakan kenikmataan kopi berkualitas tinggi
          </p>
          <button className="px-8 py-3.5 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transition-colors">
            Mulai Sekarang
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default BenefitsSection;

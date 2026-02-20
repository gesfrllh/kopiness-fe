'use client'

import React from "react";
import { motion } from 'framer-motion'

const AboutSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Left - Content */}
          <div>
            <motion.div variants={itemVariants}>
              <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Tentang Kami
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Kopi dengan Passion dan Kualitas
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-6 leading-relaxed">
              Kopiness adalah platform e-commerce kopi yang didukung oleh teknologi AI terdepan. Kami menggabungkan passion untuk kopi berkualitas dengan inovasi teknologi untuk memberikan pengalaman yang personal dan memuaskan.
            </motion.p>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
              Dari pemilihan biji kopi premium, hingga customization brew dengan AI Barista, hingga sistem pembayaran yang aman - semuanya dirancang untuk memberikan yang terbaik bagi Anda.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4">
              {['Kopi Premium dari Perkebunan Terbaik', 'AI Barista untuk Customize Brew', 'Sistem Checkout Super Cepat'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-900 rounded-full"></div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Image/Stats */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 shadow-lg">
              <div className="text-6xl text-center mb-4">☕✨</div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <p className="text-3xl font-bold text-amber-900 mb-1">100+</p>
                  <p className="text-gray-600">Variasi Brew</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <p className="text-3xl font-bold text-amber-900 mb-1">AI Powered</p>
                  <p className="text-gray-600">Barista Technology</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <p className="text-3xl font-bold text-amber-900 mb-1">1-Click</p>
                  <p className="text-gray-600">Checkout System</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection;

'use client'

import React from "react";
import { motion } from 'framer-motion'
import { BarChart3, Zap, Lightbulb } from 'lucide-react';
import Link from "next/link";

const CoffeeCustomizerSection: React.FC = () => {
  const features = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'AI Barista',
      description: 'AI cerdas menganalisis preferensi Anda untuk rekomendasi brew terbaik'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Manual Control',
      description: 'Atur roast level, strength, milk type, dan semua parameter barista'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Recipe',
      description: 'Dapatkan resep detil dengan ratio, suhu air, dan teknik brewing'
    }
  ]

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
          {/* Left - Image */}
          <motion.div
            variants={itemVariants}
            className="relative order-2 md:order-1"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-8 shadow-xl">
                <div className="text-center space-y-6">
                  <div className="text-6xl">🤖☕</div>
                  <h3 className="text-2xl font-bold text-amber-900">AI Barista Anda</h3>
                  <p className="text-sm text-amber-800">Customize brew dengan presisi</p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
                    <div>
                      <p className="text-xl font-bold text-amber-900">10+</p>
                      <p className="text-xs text-amber-700">Parameters</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-amber-900">∞</p>
                      <p className="text-xs text-amber-700">Combinations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <div className="order-1 md:order-2">
            <motion.div variants={itemVariants}>
              <span className="inline-block text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
                Fitur Unggulan
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Customize Brew Mu dengan AI
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kopiness menghadirkan teknologi AI Barista yang revolusioner. Setiap preferensi Anda dianalisis untuk menghasilkan brew sempurna dari roast level, strength, hingga jenis susu dan sirup.
            </motion.p>

            {/* Features List */}
            <motion.div variants={containerVariants} className="space-y-4 mb-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <div className="text-amber-600 mt-1 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Link
                href="/manage/coffee"
                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-800 transition-colors"
              >
                Mulai Customize Brew →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CoffeeCustomizerSection;

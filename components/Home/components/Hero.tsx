'use client'

import React, { useState } from "react";
import { motion, easeOut } from 'framer-motion'
import LoaderTransition from "@/components/LoaderTransition";
import { ArrowRight } from 'lucide-react';
import Link from "next/link";

const HeroSection: React.FC = () => {
  const [loader, setLoader] = useState(false)

  const containerVariants = {
    hidden: {},
    visible: {
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
      transition: { duration: 0.6, ease: easeOut }
    }
  }

  const coffeeBlends = ['Arabica', 'Robusta', 'Specialty', 'Single Origin']

  const sliderVariants = {
    animate: {
      x: [0, -1200],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop' as const,
          duration: 20,
          ease: 'linear'
        }
      }
    }
  }

  return (
    <>
      <LoaderTransition onFinish={() => setLoader(true)} />
      <section className="hero min-h-fit flex items-center justify-center py-12 md:py-20 overflow-hidden">
        {loader && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="hero__content text-center max-w-4xl mx-auto px-4"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-block px-4 py-2 bg-amber-50 text-amber-900 rounded-full text-sm font-medium border border-amber-200">
                  ✨ Kopi Premium Pilihan
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1 variants={itemVariants} className="hero__title text-5xl md:text-7xl font-bold leading-tight mb-6">
                Rasakan Cita Rasa
                <span className="block bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Kopi Terbaik Kami
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p variants={itemVariants} className="hero__desc text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Setiap biji kopi dipilih dengan cermat dari perkebunan terbaik di seluruh dunia. Nikmati pengalaman kopi yang tak terlupakan dengan cita rasa yang sempurna.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/manage/product" className="btn btn--primary inline-flex items-center gap-2 justify-center">
                  Lihat Produk Kami
                  <ArrowRight size={18} />
                </Link>
                <Link href="/manage/coffee" className="btn btn--outline inline-flex items-center gap-2 justify-center">
                  Customize Brew
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-8 md:gap-12">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-amber-900">500+</p>
                  <p className="text-sm text-gray-600 mt-2">Pelanggan Setia</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-amber-900">20+</p>
                  <p className="text-sm text-gray-600 mt-2">Varian Rasa</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-amber-900">4.9★</p>
                  <p className="text-sm text-gray-600 mt-2">Rating Terbaik</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Coffee Blends Slider */}
            {/* <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-0 left-0 right-0 w-full overflow-hidden"
            >
              <motion.div
                variants={sliderVariants}
                animate="animate"
                className="flex gap-6 whitespace-nowrap py-6 px-4"
              >
                {[...coffeeBlends, ...coffeeBlends].map((blend, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-amber-100 shadow-lg">
                    <span className="text-amber-900 font-semibold text-sm">{blend}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div> */}
          </>
        )}
      </section>
    </>
  )
}

export default HeroSection;
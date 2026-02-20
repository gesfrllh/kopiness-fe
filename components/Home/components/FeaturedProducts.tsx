'use client'

import React from "react";
import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react';
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

const FeaturedProducts: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Arabika Premium',
      description: 'Biji berkualitas tinggi dari perkebunan pilihan dengan roast level medium',
      price: 85000,
      image: '☕',
      badge: 'Terlaris'
    },
    {
      id: 2,
      name: 'Robusta Bold',
      description: 'Rasa kuat dan bitter, sempurna untuk espresso dan americano',
      price: 65000,
      image: '🌿',
      badge: 'Rekomendasi'
    },
    {
      id: 3,
      name: 'Single Origin Sumatra',
      description: 'Karakter earthy dengan body penuh, cocok untuk filter coffee',
      price: 95000,
      image: '🏔️',
      badge: 'Terbaru'
    },
    {
      id: 4,
      name: 'Blend Signature',
      description: 'Perpaduan sempurna 3 origin, balanced rasa & aroma yang kompleks',
      price: 75000,
      image: '🎯',
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
    <section className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Kopi Pilihan Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Setiap biji kopi dipilih langsung dari perkebunan terbaik di seluruh dunia untuk memastikan kualitas tertinggi
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div className="h-56 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-amber-900">
                      Rp {(product.price / 1000).toFixed(0)}K
                    </p>
                    <button className="p-2 bg-amber-100 text-amber-900 rounded-full hover:bg-amber-200 transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full mt-4 flex items-center justify-center gap-2 bg-amber-900 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
                    <ShoppingCart size={18} />
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/manage/product"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-amber-900 text-amber-900 font-semibold rounded-lg hover:bg-amber-900 hover:text-white transition-colors"
          >
            Lihat Semua Produk →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts;

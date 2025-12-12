'use client'

import React, { useState } from "react";
import CTA from "../../Base/cta";
import { useInfiniteSlider } from "@/hooks/useInfiniteSlider";
import { motion, easeOut } from 'framer-motion'
import LoaderTransition from "@/components/LoaderTransition";
interface Item {
  title: string,
  size: 'sm' | 'md' | 'lg'
}

const HeroSection: React.FC = () => {
  const [loader, setLoader] = useState(false)
  const ctaItem: Item[] = [
    {
      title: 'satu',
      size: 'md'
    },
    {
      title: 'dua',
      size: 'md'
    },
    {
      title: 'tiga',
      size: 'md'
    },
    {
      title: 'empat',
      size: 'md'
    },
    {
      title: 'lima',
      size: 'md'
    },
  ]

  const sliderItems = Array(5).fill(ctaItem).flat();
  const sliderRef = useInfiniteSlider<HTMLDivElement>({
    speed: 1,
    direction: 'left'
  })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
  }

  return (
    <>
      <LoaderTransition onFinish={() => setLoader(true)} />
      <div>
        {loader &&
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <CTA title="HomePage CTA" size="lg" />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex md:flex-row flex-col justify-between items-center py-8">
              <div>
                <motion.h1 variants={itemVariants} className="text-2xl font-bold mt-4">Welcome to the Home Page</motion.h1>
                <motion.p variants={itemVariants} className="mt-2 text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique molestiae ipsum exercitationem quibusdam voluptas totam amet sequi est corrupti ea, recusandae et asperiores unde fugit at tenetur aliquam suscipit consequatur. Quibusdam voluptas quod placeat culpa. Recusandae quisquam dolores ipsa a!</motion.p>
              </div>
            </motion.div>
          </div>
        }
        <motion.div
          ref={sliderRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: loader ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto no-scrollbar w-max-[1200px]"
        >
          <div className="flex gap-6 w-max px-4">
            {sliderItems.map((item, idx) => (
              <CTA key={idx} title={item.title} size={item.size} />
            ))}
          </div>
        </motion.div>
        <div>
          Tes
        </div>
      </div>
    </>
  )
}

export default HeroSection;
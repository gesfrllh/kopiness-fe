'use client'

import React from "react";
import CTA from "../../Base/cta";
import {useInfiniteSlider} from "@/hooks/useInfiniteSlider";

interface Item {
  title: string,
  size: 'sm' | 'md' | 'lg'
}

const HeroSection: React.FC = () => {
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

  const sliderItems = [...ctaItem, ...ctaItem]
  const sliderRef = useInfiniteSlider<HTMLDivElement>({
    speed: 1,
    direction: 'left'
  })

  return (
    <>
      <div>
        <CTA title="HomePage CTA" size="lg" />
        <div className="flex md:flex-row flex-col justify-between items-center py-8">
          <div>
            <h1 className="text-2xl font-bold mt-4">Welcome to the Home Page</h1>
            <p className="mt-2 text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique molestiae ipsum exercitationem quibusdam voluptas totam amet sequi est corrupti ea, recusandae et asperiores unde fugit at tenetur aliquam suscipit consequatur. Quibusdam voluptas quod placeat culpa. Recusandae quisquam dolores ipsa a!</p>
          </div>
          <div
            ref={sliderRef}
            className="overflow-x-auto no-scrollbar max-w-[750px]"
          >
            <div 
              className="flex gap-6 w-max px-4"
            >
              {sliderItems.map((item, idx) => (
                <CTA key={idx} title={item.title} size={item.size}/>
              ))}
            </div>
          </div>
        </div>
        <div>
          Tes
        </div>
      </div>
    </>
  )
}

export default HeroSection;
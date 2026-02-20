'use client'

import HeroSection from "./components/Hero"
import AboutSection from "./components/AboutSection"
import FeaturedProducts from "./components/FeaturedProducts"
import BenefitsSection from "./components/BenefitsSection"
import CoffeeCustomizerSection from "./components/CoffeeCustomizerSection"
import CheckoutSection from "./components/CheckoutSection"

export const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <FeaturedProducts />
      <CoffeeCustomizerSection />
      <CheckoutSection />
      <AboutSection />
      <BenefitsSection />
    </div>
  )
}
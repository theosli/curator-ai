'use client'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { PersonalizedSection } from '@/components/PersonalizedSection'
import '@/i18n';  // Import the i18n configuration

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Footer />
    </>
  )
}

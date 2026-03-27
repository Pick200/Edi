import Hero from '@/components/Hero'
import AudioPlayer from '@/components/AudioPlayer'
import CryptoDonation from '@/components/CryptoDonation'
import StoreSection from '@/components/StoreSection'
import GlbViewer from '@/components/GlbViewer'
import ErzeugnisseScroll from '@/components/ErzeugnisseScroll'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Hero />
      <AudioPlayer />

      {/* Send Money + Store — 50/50 */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-edi-light">
        <CryptoDonation />
        <StoreSection />
      </div>

      {/* 3D Model */}
      <GlbViewer />

      {/* Erzeugnisse Vorschau */}
      <ErzeugnisseScroll />

      {/* Footer */}
      <div className="border-t border-edi-light px-8 py-4 flex justify-between bg-edi-white">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/kontakt" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">Kontakt</Link>
      </div>
    </main>
  )
}

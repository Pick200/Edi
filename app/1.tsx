import Hero from '@/components/Hero'
import AudioPlayer from '@/components/AudioPlayer'
import Link from 'next/link'
import CryptoDonation from '@/components/CryptoDonation'

const SECOND_STORE_URL = 'https://edivers-project.vercel.app/'

export default function Home() {
  return (
    <main>
      <Hero />
      <AudioPlayer />
      <CryptoDonation />

      

      {/* Footer */}
      <div className="border-t border-edi-light px-8 py-4 flex justify-between bg-edi-white">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/lebenslauf" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">Lebenslauf</Link>
      </div>
    </main>
  )
}
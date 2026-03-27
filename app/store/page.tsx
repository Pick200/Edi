import Link from 'next/link'
import StoreCard from '@/components/StoreCard'

export const metadata = {
  title: 'Store — Edi',
  description: 'Limitierte Objekte. Handgefertigt.',
}

export default function StorePage() {
  return (
    <main className="min-h-screen bg-edi-white">

      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-8 border-b border-edi-light">
        <Link href="/" className="font-display text-2xl tracking-[0.3em] text-edi-black font-light hover:opacity-50 transition-opacity">
          EDI
        </Link>
        <div className="flex gap-8">
          <Link href="/erzeugnisse" className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">
            Erzeugnisse
          </Link>
          <Link href="/store" className="font-body text-xs tracking-widest uppercase text-edi-black">
            Store
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="px-8 pt-16 pb-12">
        <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-3">Limitierte Objekte</p>
        <h1 className="font-display text-7xl text-edi-black font-light leading-none">Store</h1>
      </div>

      {/* Products */}
      <div className="px-8 border-t border-edi-light pt-8">
        <StoreCard />
      </div>

      {/* Info */}
      <div className="px-8 py-12 border-t border-edi-light mt-8">
        <p className="font-body text-xs text-edi-gray max-w-sm leading-relaxed">
          Jedes Objekt ist limitiert. Zahlung per ETH oder auf Anfrage. Rechnung wird automatisch erstellt und per E-Mail zugestellt.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-edi-light px-8 py-4 flex justify-between">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/kontakt" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">
          Kontakt
        </Link>
      </div>

    </main>
  )
}
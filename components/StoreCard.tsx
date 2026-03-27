'use client'

import { useState } from 'react'
import Image from 'next/image'

const ETH_ADDRESS = '0x8d3b2461a4a3be80a3c8da503cb6caa8987d6b99'

const PRODUCTS = [
  {
    id: 'IDS-0001',
    name: 'Perlenkette No. 1',
    priceEur: 42,
    description: 'Handgefertigt. Limitiert auf 3 Stück. Echte Süsswasserperlen auf Seidenfaden.',
    image: '/store/ids0001.webp',
  },
  {
    id: 'IDS-0002',
    name: 'Seidenrock',
    priceEur: 285,
    description: 'Eleganter Schnitt. Einzelstück. Reine Seide, handgenäht.',
    image: '/store/ids0002.webp',
  },
  {
    id: 'IDS-0003',
    name: 'Briefmarken-Set',
    priceEur: 120,
    description: 'Kuratierte Vintage-Kollektion. 24 Briefmarken aus den Jahren 1920–1970.',
    image: '/store/ids0003.webp',
  },
]

export default function StoreCard() {
  const [selected, setSelected] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const select = (i: number) => {
    if (selected === i) { setSelected(null); setSent(false); setMessage('') }
    else { setSelected(i); setSent(false); setMessage('') }
  }

  const copy = () => {
    navigator.clipboard?.writeText(ETH_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buy = async () => {
    if (selected === null) return
    const p = PRODUCTS[selected]
    setLoading(true)
    try {
      await fetch('/api/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'store_purchase',
          message: `🛒 **KAUF-INTENT**\n📦 ${p.name} (${p.id})\n💶 ${p.priceEur} EUR\n📝 ${message || '—'}`,
        }),
      })
      setSent(true)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const product = selected !== null ? PRODUCTS[selected] : null

  return (
    <div>
      {/* Product Row */}
      <div className="grid grid-cols-3 gap-6">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => select(i)}
            className="text-left group"
          >
            <div className={`relative aspect-[3/4] overflow-hidden mb-4 transition-all duration-300 ${selected === i ? 'ring-1 ring-edi-black' : ''}`}>
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="33vw"
              />
              {selected !== null && selected !== i && (
                <div className="absolute inset-0 bg-edi-white/50" />
              )}
            </div>
            <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-1">{p.id}</p>
            <p className="font-body text-sm text-edi-black mb-1">{p.name}</p>
            <p className="font-display text-xl text-edi-black">{p.priceEur} EUR</p>
          </button>
        ))}
      </div>

      {/* Expanded panel */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: selected !== null ? '600px' : '0px' }}
      >
        {product && (
          <div className="mt-8 border-t border-edi-light pt-8 pb-8 grid grid-cols-2 gap-16">

            {/* Left: info */}
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-2">{product.id}</p>
              <h2 className="font-display text-4xl text-edi-black font-light mb-3">{product.name}</h2>
              <p className="font-body text-sm text-edi-gray leading-relaxed mb-6">{product.description}</p>
              <p className="font-display text-3xl text-edi-black mb-8">{product.priceEur} EUR</p>

              <div className="border border-edi-light p-4">
                <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-2">Zahlung per ETH</p>
                <p className="font-body text-xs text-edi-black break-all cursor-pointer" onClick={copy}>
                  {ETH_ADDRESS}
                </p>
                <p className="font-body text-xs text-edi-gray mt-1">
                  {copied ? '✓ Kopiert' : '(anklicken zum Kopieren)'}
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div className="flex flex-col justify-between">
              {!sent ? (
                <>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-4">Nachricht an uns</p>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={`Ich möchte "${product.name}" kaufen.\n\nVorname: \nNachname: \nE-Mail: \nAdresse: `}
                      rows={6}
                      className="w-full border border-edi-light bg-transparent font-body text-sm text-edi-black p-4 outline-none focus:border-edi-black transition-colors resize-none placeholder:text-edi-light leading-relaxed"
                    />
                    <p className="font-body text-xs text-edi-gray mt-2">
                      Schreib Name + E-Mail in die Nachricht — wir erstellen automatisch eine Rechnung.
                    </p>
                  </div>

                  <button
                    onClick={buy}
                    disabled={loading || !message.trim()}
                    className="mt-6 w-full border border-edi-black py-4 font-body text-xs tracking-widest uppercase text-edi-black hover:bg-edi-black hover:text-edi-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Wird gesendet…' : `Kaufen — ${product.priceEur} EUR`}
                  </button>
                </>
              ) : (
                <div className="flex flex-col justify-center h-full">
                  <p className="font-display text-4xl text-edi-black font-light mb-4">Danke.</p>
                  <p className="font-body text-sm text-edi-gray leading-relaxed mb-6">
                    Deine Nachricht ist angekommen. Wir melden uns per E-Mail mit einer Rechnung. Ohne Bezahlung keine Ware.
                  </p>
                  <button
                    onClick={() => { setSelected(null); setSent(false); setMessage('') }}
                    className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors text-left"
                  >
                    ← Zurück
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
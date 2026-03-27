'use client'

import { useState } from 'react'
import Link from 'next/link'

const ETH_ADDRESS = '0x8d3b2461a4a3be80a3c8da503cb6caa8987d6b99'

export default function KontaktPage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(ETH_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const send = async () => {
    if (!message.trim()) return
    setLoading(true)
    try {
      await fetch('/api/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'contact',
          message,
        }),
      })
      setSent(true)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-edi-white flex flex-col">

      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-8 border-b border-edi-light">
        <Link href="/" className="font-display text-2xl tracking-[0.3em] text-edi-black font-light hover:opacity-50 transition-opacity">
          EDI
        </Link>
        <div className="flex gap-8">
          <Link href="/erzeugnisse" className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">
            Erzeugnisse
          </Link>
          <Link href="/store" className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">
            Store
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 px-8 pt-16 pb-16 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">

        {/* Left: ETH */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-3">Kontakt</p>
          <h1 className="font-display text-6xl text-edi-black font-light leading-none mb-12">Schreib mir.</h1>

          <div className="mb-8">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${ETH_ADDRESS}&color=0F0F0F&bgcolor=FAFAF8`}
              alt="ETH QR"
              width={160}
              height={160}
            />
          </div>

          <div className="border border-edi-light p-4 max-w-xs">
            <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-2">Ethereum (ETH)</p>
            <p
              className="font-body text-xs text-edi-black break-all cursor-pointer"
              onClick={copy}
            >
              {ETH_ADDRESS}
            </p>
            <p className="font-body text-xs text-edi-gray mt-1">
              {copied ? '✓ Kopiert' : '(anklicken zum Kopieren)'}
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex flex-col justify-center">
          {!sent ? (
            <>
              <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-4">Nachricht</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={'Vorname: \nNachname: \nE-Mail: \nNachricht: '}
                rows={8}
                className="w-full border border-edi-light bg-transparent font-body text-sm text-edi-black p-4 outline-none focus:border-edi-black transition-colors resize-none placeholder:text-edi-light leading-relaxed mb-4"
              />
              <button
                onClick={send}
                disabled={loading || !message.trim()}
                className="w-full border border-edi-black py-4 font-body text-xs tracking-widest uppercase text-edi-black hover:bg-edi-black hover:text-edi-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'Wird gesendet…' : 'Senden'}
              </button>
            </>
          ) : (
            <div>
              <p className="font-display text-4xl text-edi-black font-light mb-4">Danke.</p>
              <p className="font-body text-sm text-edi-gray leading-relaxed mb-6">
                Nachricht angekommen. Ich melde mich.
              </p>
              <button
                onClick={() => { setSent(false); setMessage('') }}
                className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors"
              >
                ← Zurück
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-edi-light px-8 py-4 flex justify-between mt-auto">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/kontakt" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">
          Kontakt
        </Link>
      </div>

    </main>
  )
}

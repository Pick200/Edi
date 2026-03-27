'use client'

import Link from 'next/link'
import { useState } from 'react'


const SKILLS = [
  'Architekturvisualisierung',
  'Fashion Rendering',
  'Produktvisualisierung',
  '3D Modellierung',
  'Texturierung & Shading',
  'Atmosphäre & Licht',
  'Compositing',
  'Animation & Motion',
  'Website Building',
  'Server Handling',
  'Ollama',
  'Local Hosting',
  'Compositing',
  'Animation & Motion',
]

const TOOLS = [
  'PC',
  'Blender',
  'Cycles',
  'EEVEE',
  'Python',
  'HTML',
  'English',
  'French',
  'German',
  'Paper and Pen',

]

const EXPERIENCE = [
  {
    role: '3D Visualizer',
    context: 'Architekturbüro · Freiberuflich',
    period: '2022 — heute',
    desc: 'Fotorealistische Architekturvisualisierungen. Tiefgaragen, Innenräume, Außenansichten.',
  },
  {
    role: 'Fashion 3D Design',
    context: 'Eigenständige Projekte',
    period: '2023 — heute',
    desc: 'Kleidungsstücke in 3D — Kleider, Röcke, Tops. Realistische Stofffaltungen und Materialien.',
  },
]

export default function Lebenslauf() {
  const [open,    setOpen]    = useState(false)
  const [text,    setText]    = useState('')
  const [status,  setStatus]  = useState<'idle'|'sending'|'done'|'error'>('idle')

  const send = async () => {
    if (!text.trim()) return
    setStatus('sending')
    try {
      await fetch('/api/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'contact', message: text.trim() }),
      })
      setStatus('done')
      setText('')
      setTimeout(() => { setOpen(false); setStatus('idle') }, 2000)
    } catch {
      setStatus('error')
    }
  }
  return (
    <main className="min-h-screen bg-edi-white text-edi-black">

      {/* Nav */}
      <div className="px-8 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-[0.3em] text-edi-black font-light hover:opacity-50 transition-opacity">
          EDI
        </Link>
        <nav className="flex gap-10">
          <Link href="/erzeugnisse" className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">Erzeugnisse</Link>
          <Link href="/store"       className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">Store</Link>
        </nav>
      </div>

      {/* Name — mittig */}
      <div className="text-center py-20 px-8">
        <p className="font-display text-[clamp(3rem,10vw,8rem)] font-light tracking-[0.15em] leading-none text-edi-black">
          ICH BIN EDI
        </p>
      </div>

      {/* Linie */}
      <div className="w-full h-px bg-edi-black" />

      {/* Tagline */}
      <div className="text-center py-10">
        <p className="font-body text-xs tracking-[0.35em] uppercase text-edi-gray">
          3D Designer · Visualizer · Architektur &amp; Fashion Fan
        </p>
      </div>

      {/* Skills + Tools */}
      <div className="max-w-4xl mx-auto px-8 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-edi-light pt-16 mb-20">

          {/* Skills */}
          <div className="md:col-span-2">
            <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-8">Skills</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {SKILLS.map(s => (
                <div key={s} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 bg-edi-black rounded-full flex-shrink-0" />
                  <span className="font-body text-sm text-edi-black leading-snug">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-8">Tools</p>
            <div className="flex flex-col gap-4">
              {TOOLS.map(t => (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-edi-black rounded-full flex-shrink-0" />
                  <span className="font-body text-sm text-edi-black">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Erfahrung */}
        <div className="border-t border-edi-light pt-16 mb-20">
          <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-12">Erfahrung</p>
          <div className="space-y-14">
            {EXPERIENCE.map(e => (
              <div key={e.role} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12">
                <div>
                  <p className="font-display text-2xl font-light text-edi-black leading-tight">{e.role}</p>
                  <p className="font-body text-xs tracking-widest uppercase text-edi-gray mt-2">{e.period}</p>
                  <p className="font-body text-xs text-edi-gray mt-1">{e.context}</p>
                </div>
                <p className="font-body text-sm text-edi-black leading-relaxed self-center">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Kontakt */}
        <div className="border-t border-edi-black pt-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <p className="font-body text-xs tracking-widest uppercase text-edi-gray">Kontakt</p>
            <div className="flex flex-col gap-6 items-start md:items-end">
              <div className="flex gap-10">
                <button
                  onClick={() => { setOpen(o => !o); setStatus('idle') }}
                  className="font-body text-xs tracking-widest uppercase text-edi-black border-b border-edi-black pb-px hover:opacity-40 transition-opacity"
                >
                  {open ? 'Schliessen ×' : 'Send Text →'}
                </button>
                <Link
                  href="/erzeugnisse"
                  className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors"
                >
                  Erzeugnisse →
                </Link>
              </div>

              {/* Inline Textfeld */}
              {open && (
                <div className="flex flex-col gap-3 w-full md:w-80">
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Deine Nachricht…"
                    rows={4}
                    className="w-full bg-transparent border border-edi-light px-4 py-3 font-body text-sm text-edi-black placeholder:text-edi-gray resize-none focus:outline-none focus:border-edi-black transition-colors"
                  />
                  <button
                    onClick={send}
                    disabled={status === 'sending' || status === 'done'}
                    className="font-body text-xs tracking-widest uppercase text-white bg-edi-black px-6 py-3 hover:opacity-70 transition-opacity disabled:opacity-40 self-end"
                  >
                    {status === 'sending' ? 'Wird gesendet…'
                      : status === 'done'  ? 'Gesendet ✓'
                      : status === 'error' ? 'Fehler — nochmal?'
                      : 'Senden'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-edi-light px-8 py-4 flex justify-between">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">← Zurück</Link>
      </div>
    </main>
  )
}
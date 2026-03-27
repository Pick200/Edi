'use client'

import { useState } from 'react'
import Link from 'next/link'

const ITEMS = [1, 2, 3, 4, 5, 6, 7].map(n => ({
  src: `/erzeugnisse/${n}.webp`,
  id: n,
}))

// Halbkreis: 7 Karten verteilt auf -60° bis +60°
const SPREAD = 60 // Gesamtwinkel in Grad
const CENTER = (ITEMS.length - 1) / 2

export default function ErzeugnisseScroll() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="border-t border-edi-light bg-edi-white py-16 overflow-hidden">
      {/* Header */}
      <div className="px-8 mb-16 flex items-end justify-between">
        <p className="font-body text-xs tracking-widest uppercase text-edi-gray">Erzeugnisse</p>
        <Link
          href="/erzeugnisse"
          className="font-body text-xs tracking-widest uppercase text-edi-black opacity-40 hover:opacity-100 transition-opacity"
        >
          Alle ansehen →
        </Link>
      </div>

      {/* Fächer */}
      <div
        className="relative mx-auto"
        style={{ width: '100%', height: '520px' }}
      >
        {ITEMS.map(({ src, id }, i) => {
          const angle = ((i - CENTER) / CENTER) * SPREAD
          const rad   = (angle * Math.PI) / 180
          // Karten fächern sich vom unteren Mittelpunkt
          const originX = 50  // % horizontal
          const originY = 130 // % — Drehpunkt unterhalb der Karte

          const isHovered = hovered === id
          const scale     = isHovered ? 1.18 : 1.0
          const zIndex    = isHovered ? 20 : 10 - Math.abs(i - CENTER)

          // Horizontaler Versatz damit sie sich nicht überlappen
          const translateX = Math.sin(rad) * 220
          const translateY = -(Math.cos(rad) - 1) * 80

          return (
            <Link
              key={id}
              href="/erzeugnisse"
              className="absolute block overflow-hidden"
              style={{
                width:  '390px',
                height: '450px',
                left:   `calc(50% + ${translateX}px - 80px)`,
                bottom: `${100 + translateY}px`,
                transform: `rotate(${angle * 0.6}deg) scale(${scale})`,
                transformOrigin: `${originX}% ${originY}%`,
                zIndex,
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s',
                borderRadius: '2px',
                boxShadow: isHovered
                  ? '0 20px 60px rgba(0,0,0,0.18)'
                  : '0 4px 20px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={src}
                alt={`Erzeugnis ${id}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Nummer */}
              <div
                className="absolute bottom-2 right-2 font-body text-white opacity-60"
                style={{ fontSize: '10px', letterSpacing: '0.15em' }}
              >
                0{id}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
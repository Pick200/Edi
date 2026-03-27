'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const TOTAL = 7

const projects = Array.from({ length: TOTAL }, (_, i) => ({
  id:    i + 1,
  cover: `/erzeugnisse/${i + 1}.webp`,
}))

export default function Erzeugnisse() {
  const [active, setActive] = useState<number | null>(null)
  const displayed = active === null ? projects : projects.filter(p => p.id === active)

  return (
    <main className="min-h-screen bg-edi-white">
      <div className="border-b border-edi-light px-8 py-6 flex items-center justify-between sticky top-0 bg-edi-white z-10">
        <Link href="/" className="font-display text-xl tracking-[0.3em] text-edi-black font-light">EDI</Link>
        <nav className="flex gap-10">
          <span className="font-body text-xs tracking-widest uppercase text-edi-black border-b border-edi-black pb-px">Erzeugnisse</span>
          <Link href="/store" className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">Store</Link>
        </nav>
      </div>

      <div className="px-8 pt-16 pb-12">
        <h1 className="font-display text-7xl md:text-9xl font-light text-edi-black leading-none">Erzeugnisse</h1>
        <p className="font-body text-sm text-edi-gray mt-4 tracking-wide">{projects.length} Arbeiten</p>
      </div>

      <div className="px-8 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-edi-light">
        {displayed.map(project => (
          <Link key={project.id} href={`/erzeugnisse/${project.id}`}
            className="group bg-edi-white block relative aspect-[4/5] overflow-hidden">
            <Image src={project.cover} alt={`Erzeugnis ${project.id}`} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            <div className="absolute inset-0 bg-edi-black/0 group-hover:bg-edi-black/40 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <p className="font-display text-3xl text-white font-light">0{project.id}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="border-t border-edi-light px-8 py-4 flex justify-between">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">← Zurück</Link>
      </div>
    </main>
  )
}

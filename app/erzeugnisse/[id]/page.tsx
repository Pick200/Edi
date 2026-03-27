import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const TOTAL = 7

// Text pro Projekt — anpassen wie du willst
const LABELS: Record<number, { title: string; desc?: string }> = {
  1: { title: 'Erzeugnis 01' },
  2: { title: 'Erzeugnis 02' },
  3: { title: 'Erzeugnis 03' },
  4: { title: 'Erzeugnis 04' },
  5: { title: 'Erzeugnis 05' },
  6: { title: 'Erzeugnis 06' },
  7: { title: 'Erzeugnis 07' },
}

// Zusätzliche Bilder: 1: 2 → 1.webp + 1-2.webp + 1-3.webp
const EXTRA: Record<number, number> = {
   1: 2,
   4: 2,  // → 4-1.webp, 4-2.webp
   5: 4,  // → 5-1.webp, 5-2.webp, 5-3.webp, 5-4.webp
}

const projects = Array.from({ length: TOTAL }, (_, i) => {
  const id     = i + 1
  const extra  = EXTRA[id] ?? 0
  const images = Array.from({ length: extra }, (_, j) => `/erzeugnisse/${id}-${j + 1}.webp`)
  return { id, cover: `/erzeugnisse/${id}.webp`, images }
})

export function generateStaticParams() {
  return projects.map(p => ({ id: String(p.id) }))
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find(p => String(p.id) === id)
  if (!project) notFound()

  const label     = LABELS[project.id]
  const allImages = [project.cover, ...project.images]

  return (
    <main className="min-h-screen bg-edi-white">
      <div className="border-b border-edi-light px-8 py-6 flex items-center justify-between sticky top-0 bg-edi-white z-10">
        <Link href="/" className="font-display text-xl tracking-[0.3em] text-edi-black font-light">EDI</Link>
        <Link href="/erzeugnisse" className="font-body text-xs tracking-widest uppercase text-edi-gray hover:text-edi-black transition-colors">← Erzeugnisse</Link>
      </div>

      <div className="px-8 pt-16 pb-12">
        <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-3">Erzeugnis</p>
        <h1 className="font-display text-6xl md:text-8xl font-light text-edi-black leading-none">
          {label?.title ?? `0${project.id}`}
        </h1>
        {label?.desc && (
          <p className="font-body text-sm text-edi-gray mt-4 max-w-md leading-relaxed">{label.desc}</p>
        )}
      </div>

      <div className="px-8 pb-24 grid grid-cols-1 md:grid-cols-2 gap-px bg-edi-light">
        {allImages.map((src, i) => (
          <div key={i} className={`bg-edi-white relative overflow-hidden ${i === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
            <Image src={src} alt={`${label?.title} — ${i + 1}`} fill
              className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority={i === 0} />
          </div>
        ))}
      </div>

      <div className="border-t border-edi-light px-8 py-4 flex justify-between">
        <p className="font-body text-xs text-edi-gray">© {new Date().getFullYear()} Edi</p>
        <Link href="/erzeugnisse" className="font-body text-xs text-edi-gray hover:text-edi-black transition-colors">← Zurück</Link>
      </div>
    </main>
  )
}
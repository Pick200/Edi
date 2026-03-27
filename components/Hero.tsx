'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── CONFIGURATION ───────────────────────────────────────────────
const PRELOAD_AHEAD  = 50
const PRELOAD_BEHIND = 30
const INITIAL_BATCH  = 60

const TEXT_OVERLAYS = [
  { frameStart: 0.01, frameEnd: 0.08, text: 'EDI FELIX KRIEMLER', sub: null,                           position: 'bottom-center' as const },
  { frameStart: 0.30, frameEnd: 0.55, text: 'Architecture',      sub: 'Space. Structure. Human.', position: 'bottom-left'   as const },
  { frameStart: 0.70, frameEnd: 0.90, text: 'Passion & Strategic', sub: 'Made Easy.',             position: 'bottom-right'  as const },
]
// Text overlays use 0–1 progress instead of frame numbers → always correct
// regardless of total frame count

export default function Hero() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const images     = useRef<Map<number, HTMLImageElement>>(new Map())
  const loading    = useRef<Set<number>>(new Set())
  const curFrame   = useRef(0)
  const rafId      = useRef<number | null>(null)
  const frameList  = useRef<string[]>([])

  const [ready,        setReady]        = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [scrollProg,   setScrollProg]   = useState(0)
  const [showHint,     setShowHint]     = useState(true)
  const [totalFrames,  setTotalFrames]  = useState(0)

  // ── Draw ──────────────────────────────────────────────────────
  const drawFrame = useCallback((i: number) => {
    const canvas = canvasRef.current
    const img    = images.current.get(i)
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }, [])

  // ── Load single frame by index ────────────────────────────────
  const loadFrame = useCallback((i: number, onDone?: () => void) => {
    const list = frameList.current
    if (i < 0 || i >= list.length)  { onDone?.(); return }
    if (images.current.has(i) || loading.current.has(i)) { onDone?.(); return }
    loading.current.add(i)
    const img = new Image()
    img.src   = `/frames/${list[i]}`
    img.onload  = () => { images.current.set(i, img); loading.current.delete(i); onDone?.() }
    img.onerror = () => {                              loading.current.delete(i); onDone?.() }
  }, [])

  // ── Preload window ────────────────────────────────────────────
  const preloadWindow = useCallback((center: number) => {
    const total = frameList.current.length
    const start = Math.max(0, center - PRELOAD_BEHIND)
    const end   = Math.min(total - 1, center + PRELOAD_AHEAD)
    for (let i = start; i <= end; i++) loadFrame(i)
    images.current.forEach((_, key) => {
      if (key < center - PRELOAD_BEHIND * 4 || key > center + PRELOAD_AHEAD * 3)
        images.current.delete(key)
    })
  }, [loadFrame])

  // ── Fetch frame list from API, then load initial batch ────────
  useEffect(() => {
    fetch('/api/frames')
      .then(r => r.json())
      .then(({ frames }: { frames: string[] }) => {
        if (!frames.length) return
        frameList.current = frames
        setTotalFrames(frames.length)

        const batch = Math.min(INITIAL_BATCH, frames.length)
        let done = 0
        for (let i = 0; i < batch; i++) {
          loadFrame(i, () => {
            done++
            setProgress(Math.round((done / batch) * 100))
            if (done === batch) {
              setReady(true)
              drawFrame(0)
              // Background load the rest
              for (let j = batch; j < frames.length; j++) {
                setTimeout(() => loadFrame(j), (j - batch) * 8)
              }
            }
          })
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Scroll ────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return
    const section = document.getElementById('hero-section')
    if (!section) return

    const onScroll = () => {
      const total      = frameList.current.length
      if (!total) return
      const scrollTop  = window.scrollY
      const heroBottom = section.offsetHeight - window.innerHeight
      const pct        = Math.min(Math.max(scrollTop / heroBottom, 0), 1)
      const idx        = Math.min(Math.floor(pct * (total - 1)), total - 1)

      setScrollProg(pct)
      setShowHint(scrollTop < 80)

      if (idx !== curFrame.current) {
        curFrame.current = idx
        preloadWindow(idx)
        if (rafId.current) cancelAnimationFrame(rafId.current)
        rafId.current = requestAnimationFrame(() => {
          if (images.current.has(idx)) {
            drawFrame(idx)
          } else {
            for (let offset = 1; offset < 20; offset++) {
              if (images.current.has(idx - offset)) { drawFrame(idx - offset); break }
            }
          }
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ready, drawFrame, preloadWindow])

  // ── Resize ────────────────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(curFrame.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  // ── Active overlay (based on scroll progress 0–1) ─────────────
  const activeOverlay = TEXT_OVERLAYS.find(
    o => scrollProg >= o.frameStart && scrollProg <= o.frameEnd
  )

  const posClass = {
    'bottom-center': 'bottom-12 left-1/2 -translate-x-1/2 text-center',
    'bottom-left':   'bottom-12 left-12 text-left',
    'bottom-right':  'bottom-12 right-12 text-right',
  }

  return (
    <section
      id="hero-section"
      style={{ height: totalFrames ? `${totalFrames * 16}px` : '800vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-edi-black">

        {/* Loading */}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-edi-white z-20">
            <p className="font-display text-5xl tracking-widest text-edi-black mb-8">EDI</p>
            <div className="w-48 h-px bg-edi-light relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-edi-black transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-body text-xs text-edi-gray mt-4 tracking-widest uppercase">
              {progress < 100 ? `Loading ${progress}%` : 'Almost ready…'}
            </p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s ease' }}
        />

        {/* Logo */}
        <div className="absolute top-8 left-8 z-10 mix-blend-difference">
          <a href="/kontakt" className="font-display text-2xl tracking-[0.3em] text-white font-light hover:opacity-60 transition-opacity">EDI</a>
        </div>

        {/* Nav */}
        <nav className="absolute top-8 right-8 z-10 flex gap-8 mix-blend-difference">
          <a href="/erzeugnisse" className="font-body text-xs tracking-widest uppercase text-white opacity-80 hover:opacity-100 transition-opacity">Erzeugnisse</a>
          <a href="/store"       className="font-body text-xs tracking-widest uppercase text-white opacity-80 hover:opacity-100 transition-opacity">Store</a>
        </nav>

        {/* Scroll hint */}
        {showHint && ready && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 mix-blend-difference">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-white">Scroll</p>
            <div className="w-px h-12 bg-white opacity-60 animate-pulse" />
          </div>
        )}

        {/* Text overlays */}
        {activeOverlay && !showHint && (
          <div
            className={`absolute z-10 mix-blend-difference ${posClass[activeOverlay.position]}`}
            style={{ animation: 'fadeIn 0.4s ease forwards' }}
          >
            <p className="font-display text-4xl md:text-6xl text-white font-light tracking-wide leading-none">
              {activeOverlay.text}
            </p>
            {activeOverlay.sub && (
              <p className="font-body text-xs tracking-widest uppercase text-white opacity-60 mt-2">
                {activeOverlay.sub}
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

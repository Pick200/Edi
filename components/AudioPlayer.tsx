'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)

  // Autoplay on first user interaction (browser policy)
  useEffect(() => {
    const tryPlay = () => {
      if (started) return
      const audio = audioRef.current
      if (!audio) return
      audio.volume = 0.35
      audio.play().then(() => {
        setPlaying(true)
        setStarted(true)
      }).catch(() => {})
    }

    // Try immediately (some browsers allow it)
    tryPlay()

    // Fallback: first scroll or click
    window.addEventListener('scroll', tryPlay, { once: true, passive: true })
    window.addEventListener('click', tryPlay, { once: true })
    return () => {
      window.removeEventListener('scroll', tryPlay)
      window.removeEventListener('click', tryPlay)
    }
  }, [started])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(!muted)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      <div className="fixed bottom-8 left-8 z-50 flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center mix-blend-difference"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            // Pause icon
            <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
              <rect x="0" y="0" width="4" height="14" rx="1"/>
              <rect x="8" y="0" width="4" height="14" rx="1"/>
            </svg>
          ) : (
            // Play icon
            <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
              <path d="M0 0 L12 7 L0 14 Z"/>
            </svg>
          )}
        </button>

        {/* Mute/Unmute + track name */}
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 mix-blend-difference"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {/* Sound bars animation */}
          <div className="flex items-end gap-px h-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-1 bg-white rounded-sm ${playing && !muted ? 'animate-pulse' : ''}`}
                style={{
                  height: muted ? '4px' : `${4 + i * 4}px`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: muted ? 0.3 : 1,
                  transition: 'height 0.3s ease',
                }}
              />
            ))}
          </div>
          <span className="font-body text-xs tracking-widest uppercase text-white opacity-60">
            {muted ? 'Unmute' : 'AC/DC'}
          </span>
        </button>
      </div>
    </>
  )
}

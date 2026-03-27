'use client'

import { useRouter } from 'next/navigation'

const STORE_URL = '/store'
const PRODUCT_IMAGE = '/store/ids0001.webp'

export default function StoreSection() {
  const router = useRouter()

  const handleClick = async () => {
    fetch('/api/discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'store_click' }),
    }).catch(() => {})

    router.push(STORE_URL)
  }

  return (
    <section
      className="bg-edi-white border-l border-edi-light py-24 px-8 flex flex-col items-center text-center cursor-pointer group"
      onClick={handleClick}
    >
      <p className="font-body text-xs tracking-widest uppercase text-edi-gray mb-4">Store</p>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-60 h-60 border border-edi-light overflow-hidden">
          <img
            src={PRODUCT_IMAGE}
            alt="Product"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-edi-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        <p className="font-body text-xs tracking-widest uppercase text-edi-black opacity-60 group-hover:opacity-100 transition-opacity">
          Zum Store →
        </p>
      </div>
    </section>
  )
}

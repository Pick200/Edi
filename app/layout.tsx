import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Edi — 3D Design Portfolio',
  description: 'Portfolio of Edi — 3D rendering, architecture, fashion and product design.',
  keywords: ['3D design', 'rendering', 'architecture', 'fashion', 'blender', 'portfolio'],
  openGraph: {
    title: 'Edi — 3D Design Portfolio',
    description: 'Portfolio of Edi — 3D rendering, architecture, fashion and product design.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}

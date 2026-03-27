import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        'edi-white': '#FAFAF8',
        'edi-black': '#0F0F0F',
        'edi-gray': '#8A8A8A',
        'edi-light': '#E8E8E4',
      },
    },
  },
  plugins: [],
}
export default config

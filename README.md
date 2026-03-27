# Edi Portfolio

## Setup

```bash
npm install
npm run dev
```

## Deine Assets einfügen

### Frames (Hero Scroll-Sequenz)
Lege deine WebP-Frames in `public/frames/` ab:
- `frame_001.webp`, `frame_002.webp`, ... `frame_216.webp`
- Passe `TOTAL_FRAMES` in `components/Hero.tsx` an (Zeile 6)

### Projekte (Erzeugnisse)
Struktur in `public/erzeugnisse/`:
```
public/erzeugnisse/
├── tiefgarage-1/
│   ├── cover.webp
│   ├── render-1.webp
│   └── render-2.webp
├── pleated-skirt/
│   └── cover.webp
└── ...
```
Projekte in `app/erzeugnisse/page.tsx` anpassen (const projects).

### Store
Struktur in `public/store/`:
```
public/store/
├── pleated-skirt/
│   └── cover.webp
└── ...
```
Produkte in `app/store/page.tsx` anpassen (const products).

### Text-Overlays im Hero
In `components/Hero.tsx` ab Zeile 10:
```ts
const TEXT_OVERLAYS = [
  { frameStart: 5, frameEnd: 40, text: 'Scroll to explore', ... },
  ...
]
```

## Deployment (Vercel)

1. GitHub Repo erstellen, Code pushen
2. vercel.com → Import Repository
3. Framework: Next.js (wird automatisch erkannt)
4. Deploy ✓

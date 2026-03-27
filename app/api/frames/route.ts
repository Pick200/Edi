import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const framesDir = path.join(process.cwd(), 'public', 'frames')

  try {
    const files = fs.readdirSync(framesDir)
    const frames = files
      .filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'))
      .sort() // alphabetical = numerical order for zero-padded names
    return NextResponse.json({ frames, total: frames.length })
  } catch {
    return NextResponse.json({ frames: [], total: 0 }, { status: 500 })
  }
}

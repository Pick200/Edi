import { NextRequest, NextResponse } from 'next/server'

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

const EVENT_LABELS: Record<string, string> = {
  store_click:    'Store besucht',
  eth_copy:       'ETH-Adresse kopiert',
  store_purchase: 'Store-Kauf',
  contact:        'Kontaktaufnahme (Lebenslauf)',
}

export async function POST(req: NextRequest) {
  if (!WEBHOOK_URL) return NextResponse.json({ ok: false }, { status: 500 })

  const body    = await req.json().catch(() => ({}))
  const event   = body.event   ?? 'unbekannt'
  const message = body.message ?? null
  const label   = EVENT_LABELS[event] ?? event

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unbekannt'
  const ua = req.headers.get('user-agent') ?? 'unbekannt'
  const ts = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })

  const content = [
    `**${label}**`,
    `Zeit: ${ts}`,
    `IP: ${ip}`,
    `UA: ${ua.slice(0, 120)}`,
    ...(message ? [`\nNachricht:\n${message}`] : []),
  ].join('\n')

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })

  return NextResponse.json({ ok: true })
}

import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = path.resolve(process.cwd(), 'ebose.mp3')

  if (!existsSync(filePath)) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  return new Response(createReadStream(filePath) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

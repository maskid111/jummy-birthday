import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = [
    path.resolve(process.cwd(), 'ebose.mp3'),
    path.resolve(process.cwd(), 'photos', 'ebose.mp3'),
  ].find((candidate) => existsSync(candidate))

  if (!filePath) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  return new Response(createReadStream(filePath) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

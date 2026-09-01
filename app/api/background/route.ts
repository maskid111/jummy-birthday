import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = [
    path.resolve(process.cwd(), 'backgroung.jpg'),
    path.resolve(process.cwd(), 'photos', 'backgroung.jpg'),
  ].find((candidate) => existsSync(candidate))

  if (!filePath) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  return new Response(createReadStream(filePath) as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

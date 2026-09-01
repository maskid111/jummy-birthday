import { createReadStream, existsSync } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { BIRTHDAY_COOKIE_NAME, getAccessCode, isAccessTokenValid } from '@/lib/birthday-access'

type PhotoContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: PhotoContext) {
  const accessCode = getAccessCode()
  const cookie = request.headers.get('cookie') || ''
  const token = cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${BIRTHDAY_COOKIE_NAME}=`))
    ?.split('=')[1]

  if (!accessCode || !isAccessTokenValid(token, accessCode)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { id } = await context.params
  const photoNumber = Number(id)

  if (!Number.isInteger(photoNumber) || photoNumber < 1 || photoNumber > 10) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const filePath = [
    path.resolve(process.cwd(), `image (${photoNumber}).jpg`),
    path.resolve(process.cwd(), 'photos', `image (${photoNumber}).jpg`),
  ].find((candidate) => existsSync(candidate))

  if (!filePath) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const stream = createReadStream(filePath)
  const headers = new Headers({
    'Content-Type': 'image/jpeg',
    'Cache-Control': 'private, max-age=3600',
  })

  if (new URL(request.url).searchParams.has('download')) {
    headers.set('Content-Disposition', `attachment; filename="birthday-girl-photo-${photoNumber}.jpg"`)
  }

  return new Response(stream as unknown as BodyInit, { headers })
}

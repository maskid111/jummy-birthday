import { NextResponse } from 'next/server'
import { BIRTHDAY_COOKIE_NAME, createAccessToken, getAccessCode } from '@/lib/birthday-access'

export async function POST(request: Request) {
  const { code } = await request.json().catch(() => ({ code: '' }))
  const accessCode = getAccessCode()

  if (!accessCode) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  const accepted = String(code || '').trim().toUpperCase() === accessCode.trim().toUpperCase()

  const response = NextResponse.json({ ok: accepted }, { status: accepted ? 200 : 401 })

  if (accepted) {
    response.cookies.set(BIRTHDAY_COOKIE_NAME, createAccessToken(accessCode), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
  }

  return response
}

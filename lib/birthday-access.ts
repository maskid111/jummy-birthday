import { createHash, timingSafeEqual } from 'node:crypto'

export const BIRTHDAY_COOKIE_NAME = 'birthday_vault'

export function getAccessCode() {
  return process.env.BIRTHDAY_ACCESS_CODE?.trim()
}

export function createAccessToken(accessCode: string) {
  return createHash('sha256').update(`birthday-vault-v1:${accessCode}`).digest('hex')
}

export function isAccessTokenValid(token: string | undefined, accessCode: string) {
  if (!token) {
    return false
  }

  const expected = Buffer.from(createAccessToken(accessCode))
  const actual = Buffer.from(token)

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

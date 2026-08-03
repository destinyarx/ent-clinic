import { randomInt } from 'node:crypto'

const INVITE_CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const INVITE_CODE_PREFIX = 'ENT'
const INVITE_CODE_RANDOM_LENGTH = 4

export const INVITE_CODE_PATTERN = /^ENT[A-Z0-9]{4}$/

export function normalizeInviteCode(value: string) {
  return value.trim().toUpperCase()
}

export function isInviteCode(value: string) {
  return INVITE_CODE_PATTERN.test(normalizeInviteCode(value))
}

export function generateInviteCode(
  selectIndex: (maximum: number) => number = (maximum) => randomInt(maximum),
) {
  let suffix = ''

  for (let index = 0; index < INVITE_CODE_RANDOM_LENGTH; index += 1) {
    suffix += INVITE_CODE_ALPHABET[selectIndex(INVITE_CODE_ALPHABET.length)]
  }

  return `${INVITE_CODE_PREFIX}${suffix}`
}

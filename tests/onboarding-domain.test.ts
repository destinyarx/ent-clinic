import assert from 'node:assert/strict'
import test from 'node:test'
import { generateInviteCode, isInviteCode, normalizeInviteCode } from '../features/onboarding/domain/inviteCode'
import { isStaffRole, normalizeClinicName, normalizePersonName } from '../features/onboarding/domain/onboarding'

test('invite codes use the ENT prefix and exactly four uppercase alphanumeric characters', () => {
  assert.equal(generateInviteCode(() => 0), 'ENTAAAA')
  assert.match(generateInviteCode(), /^ENT[A-Z0-9]{4}$/)
})

test('invite codes are normalized before validation', () => {
  assert.equal(normalizeInviteCode(' ent21er '), 'ENT21ER')
  assert.equal(isInviteCode(' ent21er '), true)
  assert.equal(isInviteCode('ENT-21ER'), false)
  assert.equal(isInviteCode('ENT123'), false)
})

test('only doctor and attendant are requestable roles', () => {
  assert.equal(isStaffRole('doctor'), true)
  assert.equal(isStaffRole('attendant'), true)
  assert.equal(isStaffRole('owner'), false)
  assert.equal(isStaffRole('admin'), false)
})

test('names are trimmed and internal whitespace is collapsed', () => {
  assert.equal(normalizePersonName('  Ada   Lovelace '), 'Ada Lovelace')
  assert.equal(normalizeClinicName('  ENT   Care  '), 'ENT Care')
})

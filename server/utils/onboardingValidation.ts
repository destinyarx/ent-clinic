import { isInviteCode } from '@/features/onboarding/domain/inviteCode'
import { isStaffRole, normalizeClinicName, normalizePersonName } from '@/features/onboarding/domain/onboarding'

export function requireProfileNames(body: { firstName?: unknown; lastName?: unknown }) {
  const firstName = normalizePersonName(body.firstName)
  const lastName = normalizePersonName(body.lastName)

  if (!firstName || !lastName) {
    throw createError({ statusCode: 400, statusMessage: 'First and last name are required' })
  }

  if (firstName.length > 30 || lastName.length > 30) {
    throw createError({ statusCode: 400, statusMessage: 'First and last name must be 30 characters or fewer' })
  }

  return { firstName, lastName }
}

export function requireClinicName(value: unknown) {
  const clinicName = normalizeClinicName(value)

  if (!clinicName) {
    throw createError({ statusCode: 400, statusMessage: 'Clinic name is required' })
  }

  if (clinicName.length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Clinic name must be 120 characters or fewer' })
  }

  return clinicName
}

export function requireJoinRequestInput(body: {
  inviteCode?: unknown
  role?: unknown
  firstName?: unknown
  lastName?: unknown
}) {
  const names = requireProfileNames(body)

  if (typeof body.inviteCode !== 'string' || !isInviteCode(body.inviteCode)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid seven-character ENT clinic code' })
  }

  if (!isStaffRole(body.role)) {
    throw createError({ statusCode: 400, statusMessage: 'Choose doctor or attendant' })
  }

  return { ...names, inviteCode: body.inviteCode, role: body.role }
}

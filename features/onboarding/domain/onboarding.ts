export const STAFF_ROLES = ['doctor', 'attendant'] as const

export type StaffRole = (typeof STAFF_ROLES)[number]
export type JoinRequestStatus = 'pending' | 'approved' | 'rejected'
export type OnboardingState = 'onboarding' | 'pending' | 'member'

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && STAFF_ROLES.includes(value as StaffRole)
}

export function normalizePersonName(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

export function normalizeClinicName(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

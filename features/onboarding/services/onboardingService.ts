import type { StaffRole } from '../domain/onboarding'
import type { ClinicJoinRequest, OnboardingStatus } from '../types/onboarding'

export function fetchOnboardingStatus() {
  const fetcher = import.meta.server ? useRequestFetch() : $fetch
  return fetcher<{ data: OnboardingStatus }>('/api/auth/onboarding')
}

export function createClinic(input: {
  clinicName: string
  firstName: string
  lastName: string
}) {
  return $fetch('/api/onboarding/organization', { method: 'POST', body: input })
}

export function requestClinicAccess(input: {
  inviteCode: string
  role: StaffRole
  firstName: string
  lastName: string
}) {
  return $fetch('/api/onboarding/join-request', { method: 'POST', body: input })
}

export function fetchClinicJoinRequests() {
  return $fetch<{ data: ClinicJoinRequest[] }>('/api/organizations/join-requests')
}

export function approveClinicJoinRequest(requestId: number) {
  return $fetch(`/api/organizations/join-requests/${requestId}/approve`, { method: 'POST' })
}

export function rejectClinicJoinRequest(requestId: number) {
  return $fetch(`/api/organizations/join-requests/${requestId}/reject`, { method: 'POST' })
}

export function fetchClinicInviteCode() {
  return $fetch<{ data: { inviteCode: string } }>('/api/organizations/invite-code')
}

export function regenerateClinicInviteCode() {
  return $fetch<{ data: { inviteCode: string } }>('/api/organizations/invite-code', { method: 'PATCH' })
}

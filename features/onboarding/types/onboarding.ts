import type { JoinRequestStatus, OnboardingState, StaffRole } from '../domain/onboarding'

export interface PendingJoinRequestSummary {
  id: number
  organizationName: string
  requestedRole: StaffRole
  status: JoinRequestStatus
  createdAt: string
}

export interface OnboardingStatus {
  state: OnboardingState
  firstName: string
  lastName: string
  email: string
  pendingRequest: PendingJoinRequestSummary | null
  rejectionMessage: string | null
}

export interface ClinicJoinRequest {
  id: number
  userName: string
  email: string
  requestedRole: StaffRole
  createdAt: string
}

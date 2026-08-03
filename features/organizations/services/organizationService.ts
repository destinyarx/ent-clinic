import type { OrganizationProfile, OrganizationSummary } from '../types/organization'

interface OrganizationListResponse {
  data: OrganizationSummary[]
}

interface OrganizationProfileResponse {
  data: OrganizationProfile
}

export function fetchOrganizations() {
  return $fetch<OrganizationListResponse>('/api/organizations')
}

export function fetchOrganizationProfile() {
  const fetcher = import.meta.server ? useRequestFetch() : $fetch
  return fetcher<OrganizationProfileResponse>('/api/auth/profile')
}

export function selectActiveOrganization(orgId: string) {
  return $fetch<{ data: { activeOrgId: string } }>('/api/organizations/active', {
    method: 'PATCH',
    body: { orgId },
  })
}

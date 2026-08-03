export type OrganizationRole = 'owner' | 'admin' | 'attendant' | 'doctor'

export interface OrganizationSummary {
  id: string
  name: string
  role: OrganizationRole
}

export interface OrganizationProfile {
  id: string
  name: string
  birthdate: string | null
  email: string | null
  role: OrganizationRole | null
  permissions: string[]
  position: string | null
  designationArea: string | null
  licenseNumber: string | null
  activeOrgId: string | null
  organizations: OrganizationSummary[]
}

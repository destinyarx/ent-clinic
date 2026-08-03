import { fetchOrganizationProfile } from '@/features/organizations/services/organizationService'
import type { OrganizationProfile } from '@/features/organizations/types/organization'
import { useOrganizationStore } from '@/features/organizations/stores/useOrganizationStore'

export type UserProfile = OrganizationProfile

export const useUserStore = defineStore(
  'user',
  () => {
    const profile = ref<UserProfile | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const organizationStore = useOrganizationStore()

    function hasPermission(permission: string) {
      return profile.value?.permissions.includes(permission) ?? false
    }

    function signOut() {
      profile.value = null
      organizationStore.clear()
    }

    async function setUserInfo() {
      loading.value = true
      error.value = null

      try {
        const response = await fetchOrganizationProfile()
        profile.value = response.data
        organizationStore.setActiveOrgId(response.data.activeOrgId)
      } catch (caughtError) {
        error.value = caughtError instanceof Error ? caughtError.message : 'Unable to load user profile'
        profile.value = null
      } finally {
        loading.value = false
      }
    }

    return {
      profile,
      loading,
      error,
      hasPermission,
      setUserInfo,
      signOut,
    }
  },
  { persist: true },
)

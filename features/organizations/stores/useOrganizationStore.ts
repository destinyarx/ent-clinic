export const useOrganizationStore = defineStore(
  'organization',
  () => {
    const activeOrgId = ref<string | null>(null)

    function setActiveOrgId(orgId: string | null) {
      activeOrgId.value = orgId
    }

    function clear() {
      activeOrgId.value = null
    }

    return { activeOrgId, setActiveOrgId, clear }
  },
  { persist: true },
)

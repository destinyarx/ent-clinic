import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchOrganizations, selectActiveOrganization } from '../services/organizationService'

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => (await fetchOrganizations()).data,
    enabled: import.meta.client,
  })
}

export function useSelectActiveOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: selectActiveOrganization,
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })
}

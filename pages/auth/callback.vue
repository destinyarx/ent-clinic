<template>
  <div class="flex min-h-[80vh] items-center justify-center bg-slate-700 px-5">
    <Card class="w-full max-w-md text-center">
      <template #content>
        <i v-if="!errorMessage" class="pi pi-spin pi-spinner mb-5 text-4xl text-sky-600" aria-hidden="true" />
        <h1 class="text-2xl font-semibold">{{ errorMessage ? 'Authentication failed' : 'Completing sign in' }}</h1>
        <p class="mt-3 text-slate-600">{{ errorMessage || 'Please wait while we securely finish your session.' }}</p>
        <Button v-if="errorMessage" label="Return to login" class="mt-6" @click="navigateTo('/auth/login')" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { fetchOnboardingStatus } from '@/features/onboarding/services/onboardingService'
import { getApiErrorMessage } from '@/utils/apiError'

definePageMeta({ layout: 'guest-layout' })

const route = useRoute()
const supabase = useSupabaseClient()
const errorMessage = ref(typeof route.query.error_description === 'string' ? route.query.error_description : '')

onMounted(async () => {
  if (errorMessage.value) return

  try {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const fragmentError = fragment.get('error_description')
    if (fragmentError) throw new Error(fragmentError)

    const { data: userData, error } = await supabase.auth.getUser()
    if (error || !userData.user) throw error ?? new Error('No authenticated user was returned')

    const { data } = await fetchOnboardingStatus()
    await navigateTo(data.state === 'member'
      ? '/new-dashboard'
      : data.state === 'pending'
        ? '/auth/pending'
        : '/auth/onboarding')
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'We could not complete authentication. Please try again.')
  }
})
</script>

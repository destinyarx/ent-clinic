<template>
  <div class="flex min-h-[85vh] items-center justify-center bg-slate-700 px-5">
    <Card class="w-full max-w-lg text-center">
      <template #content>
        <i class="pi pi-clock mb-5 text-5xl text-amber-500" aria-hidden="true" />
        <h1 class="text-3xl font-semibold">Your request is pending</h1>
        <p v-if="request" class="mt-4 text-slate-600">
          An owner or admin at <strong>{{ request.organizationName }}</strong> must approve your
          <strong>{{ request.requestedRole }}</strong> request before you can enter the clinic workspace.
        </p>
        <p class="mt-3 text-sm text-slate-500">This page checks automatically every 10 seconds.</p>
        <p v-if="errorMessage" class="mt-4 text-sm text-red-600" role="alert">{{ errorMessage }}</p>

        <div class="mt-7 flex justify-center gap-3">
          <Button label="Check now" icon="pi pi-refresh" outlined :loading="checking" @click="checkStatus" />
          <Button label="Sign out" severity="secondary" @click="signOut" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { fetchOnboardingStatus } from '@/features/onboarding/services/onboardingService'
import { getApiErrorMessage } from '@/utils/apiError'

definePageMeta({ layout: 'guest-layout' })

const supabase = useSupabaseClient()
const checking = ref(false)
const errorMessage = ref('')
const request = ref<Awaited<ReturnType<typeof fetchOnboardingStatus>>['data']['pendingRequest']>(null)
let pollTimer: ReturnType<typeof setInterval> | undefined

async function checkStatus() {
  if (checking.value) return
  checking.value = true
  errorMessage.value = ''

  try {
    const { data } = await fetchOnboardingStatus()
    request.value = data.pendingRequest

    if (data.state === 'member') {
      await navigateTo('/new-dashboard')
    } else if (data.state === 'onboarding') {
      await navigateTo('/auth/onboarding')
    }
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'Unable to check the request status.')
  } finally {
    checking.value = false
  }
}

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/auth/login')
}

onMounted(() => {
  void checkStatus()
  pollTimer = setInterval(() => void checkStatus(), 10_000)
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

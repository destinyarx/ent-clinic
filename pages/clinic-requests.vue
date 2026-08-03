<template>
  <div>
    <div class="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold">Clinic requests</h1>
        <p class="mt-1 text-slate-600 dark:text-slate-300">Review staff who asked to join your clinic.</p>
      </div>
      <Button label="Refresh" icon="pi pi-refresh" outlined :loading="loading" @click="loadData" />
    </div>

    <Card class="mb-7">
      <template #title>Clinic invite code</template>
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm text-slate-500">Share this code with doctors and attendants you expect to join.</p>
            <p class="mt-2 font-mono text-3xl font-bold tracking-[0.2em] text-sky-700">{{ inviteCode || '-------' }}</p>
          </div>
          <div class="flex gap-2">
            <Button label="Copy" icon="pi pi-copy" outlined :disabled="!inviteCode" @click="copyInviteCode" />
            <Button label="Regenerate" icon="pi pi-refresh" severity="warn" outlined :loading="regenerating" @click="regenerateCode" />
          </div>
        </div>
      </template>
    </Card>

    <Message v-if="errorMessage" severity="error" class="mb-5">{{ errorMessage }}</Message>

    <Card>
      <template #title>Pending requests</template>
      <template #content>
        <DataTable :value="requests" :loading="loading" striped-rows responsive-layout="scroll" empty-message="No pending join requests.">
          <Column field="userName" header="Name" />
          <Column field="email" header="Email" />
          <Column field="requestedRole" header="Requested role">
            <template #body="{ data }">
              <Tag :value="data.requestedRole" severity="info" class="capitalize" />
            </template>
          </Column>
          <Column field="createdAt" header="Requested">
            <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
          </Column>
          <Column header="Actions">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button label="Approve" size="small" severity="success" :loading="reviewingId === data.id" @click="approve(data.id, data.userName)" />
                <Button label="Reject" size="small" severity="danger" outlined :loading="reviewingId === data.id" @click="reject(data.id, data.userName)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  approveClinicJoinRequest,
  fetchClinicInviteCode,
  fetchClinicJoinRequests,
  regenerateClinicInviteCode,
  rejectClinicJoinRequest,
} from '@/features/onboarding/services/onboardingService'
import type { ClinicJoinRequest } from '@/features/onboarding/types/onboarding'
import { getApiErrorMessage } from '@/utils/apiError'

definePageMeta({ layout: 'authenticated-layout' })

const authStore = useUserStore()
const { success, errorNotification, confirmNotification } = useNotification()
const requests = ref<ClinicJoinRequest[]>([])
const inviteCode = ref('')
const loading = ref(false)
const regenerating = ref(false)
const reviewingId = ref<number | null>(null)
const errorMessage = ref('')

if (authStore.profile?.role !== 'owner' && authStore.profile?.role !== 'admin') {
  await navigateTo('/new-dashboard')
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

async function loadData() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [requestResponse, codeResponse] = await Promise.all([
      fetchClinicJoinRequests(),
      fetchClinicInviteCode(),
    ])
    requests.value = requestResponse.data
    inviteCode.value = codeResponse.data.inviteCode
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, 'Unable to load clinic requests.')
  } finally {
    loading.value = false
  }
}

async function copyInviteCode() {
  try {
    await navigator.clipboard.writeText(inviteCode.value)
    success('Invite code copied.')
  } catch {
    errorNotification('Unable to copy automatically. Select and copy the code manually.')
  }
}

async function regenerateCode() {
  const confirmed = await confirmNotification(
    'The old code will stop accepting new requests. Existing pending requests will remain.',
    'Regenerate invite code?',
  )
  if (!confirmed) return

  regenerating.value = true

  try {
    const response = await regenerateClinicInviteCode()
    inviteCode.value = response.data.inviteCode
    success('Invite code regenerated.')
  } catch (error) {
    errorNotification(getApiErrorMessage(error, 'Unable to regenerate the invite code.'))
  } finally {
    regenerating.value = false
  }
}

async function approve(id: number, name: string) {
  const confirmed = await confirmNotification(`Approve ${name} with their requested role?`, 'Approve join request?')
  if (!confirmed) return

  reviewingId.value = id
  try {
    await approveClinicJoinRequest(id)
    requests.value = requests.value.filter((request) => request.id !== id)
    success(`${name} can now access the clinic.`)
  } catch (error) {
    errorNotification(getApiErrorMessage(error, 'Unable to approve the request.'))
  } finally {
    reviewingId.value = null
  }
}

async function reject(id: number, name: string) {
  const confirmed = await confirmNotification(`${name} will return to onboarding and may apply again.`, 'Reject join request?')
  if (!confirmed) return

  reviewingId.value = id
  try {
    await rejectClinicJoinRequest(id)
    requests.value = requests.value.filter((request) => request.id !== id)
    success(`${name}'s request was rejected.`)
  } catch (error) {
    errorNotification(getApiErrorMessage(error, 'Unable to reject the request.'))
  } finally {
    reviewingId.value = null
  }
}

onMounted(() => void loadData())
</script>

<template>
  <div class="flex min-h-[85vh] items-center justify-center bg-slate-700 px-5 py-8">
    <Card class="w-full max-w-3xl">
      <template #content>
        <div class="mx-auto max-w-2xl">
          <h1 class="text-center text-3xl font-semibold">Set up your clinic access</h1>
          <p class="mt-2 text-center text-slate-600">Tell us who you are, then create a clinic or request access to one.</p>

          <Message v-if="status?.rejectionMessage" severity="warn" class="mt-6">{{ status.rejectionMessage }}</Message>

          <div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col">
              <label for="onboarding-first-name" class="mb-1 font-medium">First name</label>
              <InputText id="onboarding-first-name" v-model="firstName" maxlength="30" autocomplete="given-name" />
            </div>
            <div class="flex flex-col">
              <label for="onboarding-last-name" class="mb-1 font-medium">Last name</label>
              <InputText id="onboarding-last-name" v-model="lastName" maxlength="30" autocomplete="family-name" />
            </div>
          </div>

          <div class="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            <button type="button" class="rounded-xl border-2 p-5 text-left transition" :class="path === 'owner' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-300'" @click="path = 'owner'">
              <span class="block text-lg font-semibold">I own a clinic</span>
              <span class="mt-1 block text-sm text-slate-600">Create a clinic and become its owner.</span>
            </button>
            <button type="button" class="rounded-xl border-2 p-5 text-left transition" :class="path === 'staff' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-sky-300'" @click="path = 'staff'">
              <span class="block text-lg font-semibold">I am joining a clinic</span>
              <span class="mt-1 block text-sm text-slate-600">Request access as a doctor or attendant.</span>
            </button>
          </div>

          <div v-if="path === 'owner'" class="mt-6">
            <label for="clinic-name" class="mb-1 block font-medium">Clinic name</label>
            <InputText id="clinic-name" v-model="clinicName" maxlength="120" class="w-full" placeholder="Example ENT Clinic" />
          </div>

          <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex flex-col">
              <label for="invite-code" class="mb-1 font-medium">Clinic invite code</label>
              <InputText id="invite-code" v-model="inviteCode" maxlength="7" class="uppercase" placeholder="ENT21ER" @update:model-value="normalizeCode" />
              <small class="mt-1 text-slate-500">Seven characters beginning with ENT</small>
            </div>
            <div class="flex flex-col">
              <label for="requested-role" class="mb-1 font-medium">Your role</label>
              <Select id="requested-role" v-model="role" :options="roles" option-label="label" option-value="value" placeholder="Choose a role" />
            </div>
          </div>

          <p v-if="formError" class="mt-4 text-sm text-red-600" role="alert">{{ formError }}</p>

          <div class="mt-7 flex justify-end">
            <Button :label="path === 'owner' ? 'Create clinic' : 'Request access'" severity="success" :loading="submitting" @click="submit" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { createClinic, fetchOnboardingStatus, requestClinicAccess } from '@/features/onboarding/services/onboardingService'
import type { StaffRole } from '@/features/onboarding/domain/onboarding'
import { getApiErrorMessage } from '@/utils/apiError'

definePageMeta({ layout: 'guest-layout' })

const { data: response } = await useAsyncData('onboarding-status', fetchOnboardingStatus)
const status = computed(() => response.value?.data)
const path = ref<'owner' | 'staff'>('owner')
const firstName = ref(status.value?.firstName ?? '')
const lastName = ref(status.value?.lastName ?? '')
const clinicName = ref('')
const inviteCode = ref('')
const role = ref<StaffRole | null>(null)
const submitting = ref(false)
const formError = ref('')
const roles = [
  { label: 'Doctor', value: 'doctor' },
  { label: 'Attendant', value: 'attendant' },
]

function normalizeCode(value: string | undefined) {
  inviteCode.value = (value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
}

async function submit() {
  formError.value = ''

  if (!firstName.value.trim() || !lastName.value.trim()) {
    formError.value = 'First and last name are required.'
    return
  }

  submitting.value = true

  try {
    if (path.value === 'owner') {
      if (!clinicName.value.trim()) throw new Error('Clinic name is required.')
      await createClinic({ clinicName: clinicName.value, firstName: firstName.value, lastName: lastName.value })
      await navigateTo('/new-dashboard')
      return
    }

    if (!role.value) throw new Error('Choose doctor or attendant.')
    await requestClinicAccess({ inviteCode: inviteCode.value, role: role.value, firstName: firstName.value, lastName: lastName.value })
    await navigateTo('/auth/pending')
  } catch (error) {
    formError.value = getApiErrorMessage(error, 'Unable to complete clinic setup.')
  } finally {
    submitting.value = false
  }
}
</script>

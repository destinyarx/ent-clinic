<template>
    <!-- TODO: add slot for main content or footer here -->
    <PatientNavbar :patient="patient?.data ?? undefined"/>
    <PatientTabs :id="id" :status="patient?.data?.status"/>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

import PatientNavbar from '@/components/PatientNavbar.vue';
import PatientTabs from '~/components/PatientTabs.vue';

interface Patient {
    id: number,
    age: number,
    address: string,
    allergies: string[]
}

const { id } = useRoute().params
const patient = ref<Patient>()
const loading = ref<boolean>(false)
const error   = ref<Error|null>(null)

const fetchPatientDetails = async() => {
    try {
        loading.value = true;
        patient.value = await $fetch(`/api/patient/details/get-patient-details?id=${id}`)
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('Unknown fetch error')
    } finally {
        loading.value = false
    }
}

const gender = {
    'M': 'Male',
    'F': 'Female',
    'X': 'Unknown'
}

onMounted(async () => {
  await fetchPatientDetails();
})
</script>

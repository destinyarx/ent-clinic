<template>
    <!-- TODO: add slot for main content or footer here -->
    <PatientNavbar :patient="patient"/>

    <PatientTabs 
        @setCurrentTab="setCurrentTab"
        :id="patientId" 
        :status="patient?.status"
    />

    <template v-if="currentTab === 'diagnosis'">
        <Diagnosis :id="patientId" :encounterId="encounterId"/>
    </template>
    <template v-else-if="currentTab === 'medication'">
        <Medications :id="patientId" :encounterId="encounterId"/>
    </template>
    <template v-else-if="currentTab === 'vitals'">
        <Vitals :id="patientId" :encounterId="encounterId"/>
    </template>
    <template v-else-if="currentTab === 'medicalHistory'">
        <MedicalHistory :id="patientId"/>
    </template>
    <template v-else-if="currentTab === 'encounterHistory'">
        <EncounterHistory :id="patientId"/>
    </template>

</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

import PatientNavbar from '@/components/PatientNavbar.vue';
import PatientTabs from '@/components/PatientTabs.vue';
import Diagnosis from '@/components/medical-record/Diagnosis.vue'
import Medications from '@/components/medical-record/Medications.vue'
import Vitals from '@/components/medical-record/Vitals.vue'
import MedicalHistory from '@/components/history/MedicalHistory.vue'
import EncounterHistory from '@/components/history/EncounterHistory.vue'

interface Patient {
    id: number,
    age: number,
    address: string,
    allergies: string[]
}

const { id } = useRoute().params
const patientId = Number(id)
const patient = ref<any>()
const encounterId = ref<number | null>()
const loading = ref<boolean>(false)
const error   = ref<Error|null>(null)

const gender = {
    'M': 'Male',
    'F': 'Female',
    'X': 'Unknown'
}

const fetchPatientDetails = async() => {
    try {
        loading.value = true;
        const response = await $fetch(`/api/patient/details/get-patient-details?id=${id}`)
        patient.value = response.data.patient;
        encounterId.value = response.data.encounterId;
        console.log(patient.value)
    } catch (err) {
        error.value = err instanceof Error ? err : new Error('Unknown fetch error')
    } finally {
        loading.value = false
    }
}

const currentTab = ref<string>();
const setCurrentTab = (tab: string) => {
    currentTab.value = tab;
}


onMounted(async () => {
  await fetchPatientDetails();
})
</script>

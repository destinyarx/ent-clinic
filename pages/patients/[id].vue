<template>
    <div class="flex justify-center">   
        Patient Details:
    </div>

    <div class="flex flex-col justify-start items-start">
        <div class="mt-2">
            <span class="font-bold text-sm">Name:</span>
            {{ patient?.data?.firstName }}
            {{ patient?.data?.middleName ? patient?.data?.middleName.charAt(0) + '.' : '' }}
            {{ patient?.data?.lastName }}
        </div>

        <div class="mt-2">
            <span class="font-bold text-sm">Gender:</span>
            {{ patient?.data?.gender ? gender[patient.data.gender] : 'Unknown' }}
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

const { id } = useRoute().params
const patient = ref<any>(null)
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

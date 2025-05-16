<template>
    <div class="flex justify-center">   
        Patient Details:
    </div>


    <div class="flex flex-col justify-start items-start text-sm">
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

        <div class="flex flex-row flex-wrap mt-2">
            <span class="font-semibold text-sm mr-2">
                Allergies:
            </span>

            <template v-if="patient?.data?.allergies.length" >
                <Badge v-for="(item, index) in patient.data.allergies" class="bg-neutral-300 mr-1">
                    {{ item }}
                </Badge>
            </template>

            <template v-else>
                <p class="italic">No allergies recorded.</p>
            </template>
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

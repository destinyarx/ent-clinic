<template>
    <div class="flex flex-col text-lg">
        <div class="flex flex-row mb-8">
            <div class="w-1/3 mr-5">
                <InputText v-model="patientFormData.firstName" variant="outlined" placeholder="First Name"  />
            </div>

            <div class="w-1/3 mr-5">
                <InputText v-model="patientFormData.middleName" variant="outlined" placeholder="Middle Name" />
            </div>

            <div class="w-1/3">
                <InputText v-model="patientFormData.lastName" variant="outlined" placeholder="Last Name" />
            </div>
        </div>

        <div class="flex flex-row justify-between mb-8">
            <div class="w-1/3 mr-5">
                <Select v-model="patientFormData.gender" :options="genderOptions" optionLabel="name" placeholder="Gender" class="w-full text-base"/>
            </div>

            <div class="w-1/3 mr-5">
                <DatePicker v-model="patientFormData.birthdate" showIcon class="w-full text-base"/>
            </div>

            <div class="w-1/3">
                <InputNumber v-model="patientFormData.contactNumber" variant="outlined" placeholder="Contact Number" class="w-full" />
            </div>
        </div>

        <div class="w-full mb-8">
            <InputText v-model="patientFormData.address" variant="outlined" placeholder="Address" class="w-full"/>
        </div>

        <div class="flex justify-center">
            <Button @click="addPatient" severity="success" label="Add Patient" class="mt-5" />
        </div>

        <div v-if="loading" class="text-cyan-400 text-lg mt-5">
            loading....
        </div>
    </div>
</template>

<script setup lang="ts">
const patientFormData = ref({
    firstName: null,
    middleName: null,
    lastName: null,
    address: null,
    gender: null,
    contactNumber: null,
    birthdate: null,
    loading: false,
});

const loading = ref(false);
const genderOptions = ref([
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Choose not to disclose', code: 'X' },
]);

const addPatient = async () => {
    loading.value = true
    const patientData = { ...patientFormData.value };

    try {
        const response = await $fetch('/api/patient/add', {
            method: 'POST',
            body: {
                patientData: patientData
            }
        })  

        console.log(patientData);
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}
</script>
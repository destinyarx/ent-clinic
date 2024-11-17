<template>
    <div class="flex flex-col text-lg">
        <div class="flex flex-row mb-8">
            <div class="w-1/3 mr-5">
                <InputText v-model="props.formData.firstName" variant="outlined" placeholder="First Name"  />
            </div>

            <div class="w-1/3 mr-5">
                <InputText v-model="props.formData.middleName" variant="outlined" placeholder="Middle Name" />
            </div>

            <div class="w-1/3">
                <InputText v-model="props.formData.lastName" variant="outlined" placeholder="Last Name" />
            </div>
        </div>

        <div class="flex flex-row justify-between mb-8">
            <div class="w-1/3 mr-5">
                <Select v-model="props.formData.gender" :options="genderOptions" optionLabel="name" optionValue="code" placeholder="Gender" class="w-full text-base"/>
            </div>

            <div class="w-1/3 mr-5">
                <DatePicker v-model="props.formData.birthdate" showIcon class="w-full text-base"/>
            </div>

            <div class="w-1/3">
                <InputNumber v-model="props.formData.contactNumber" variant="outlined" placeholder="Contact Number" class="w-full" />
            </div>
        </div>

        <div class="w-full mb-8">
            <InputText v-model="props.formData.address" variant="outlined" placeholder="Address" class="w-full"/>
        </div>

        <div class="flex justify-center">
            <Button @click="props.action === 'insert' ? addPatient() : updatePatient()" severity="success" :label="props.action === 'insert' ? 'Add Patient' : 'Update Patient'" class="mt-5" />
        </div>

        <div v-if="loading" class="text-cyan-400 text-lg mt-5">
            loading....
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    action: string,
    formData: Object
}>();

const emit = defineEmits(['insertDone']);

const loading = ref(false);
const genderOptions = ref([
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Choose not to disclose', code: 'X' },
]);

const addPatient = async () => {
    loading.value = true

    try {
        const response = await $fetch('/api/patient/add', {
            method: 'POST',
            body: {
                patientData: props.formData
            }
        })  
        emit('insertDone');
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}

const updatePatient = async () => {
    console.log('Patient Updated');

    // add api calls to update a patient
}
</script>
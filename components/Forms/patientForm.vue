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

const emit = defineEmits(['processDone']);

const loading = ref(false);
const genderOptions = ref([
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Choose not to disclose', code: 'X' },
]);

const addPatient = async () => {
    loading.value = true
    const token =  "eyJhbGciOiJIUzI1NiIsImtpZCI6ImkwQjZSU0ZwU2hQR1dQV2kiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2dneW9na2liZWJpanl5am5pc2JhLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0ZjQxOGEzMS1jMWJlLTQwMWItYjdhOC0wMTVkMzlmMmJkNmYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMyMDMyOTk3LCJpYXQiOjE3MzIwMjkzOTcsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTczMjAyOTM5N31dLCJzZXNzaW9uX2lkIjoiMWRiM2EyZDItZWFjZi00OTQwLTk5Y2MtMmI4MTkzN2JmZTJhIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.pQcOa_IiDblhLGLjiMJGmGDtz8PTd6yuQILKt9pq5mA";


    try {
        const response = await $fetch('/api/patient/details/add', {
            method: 'POST',
            // headers: {
            //     "Authorization": `Bearer ${token}`,
            //     "Content-Type": "application/json",
            // },
            body: {
                patientData: props.formData
            }
        })  
        emit('processDone');
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}

const updatePatient = async () => {
    loading.value = true;

    await $fetch('/api/patient/details/update', {
        method: 'POST',
        body: {
            patientData: props.formData
        }
    }).then(response => {
        console.log(response.data)
    }).catch(error => {
        console.log(error)
    })
    
    emit('processDone');
    loading.value = false;
}
</script>
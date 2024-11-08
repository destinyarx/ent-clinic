<template>
    <div class="flex flex-col justify-center gap-3 items-center mt-20 text-2xl">
        <InputText v-model="firstName" variant="outlined" placeholder="First Name" />
        <InputText v-model="middleName" variant="outlined" placeholder="Middle Name" />
        <InputText v-model="lastName" variant="outlined" placeholder="Last Name" />
        <InputText v-model="address" variant="outlined" placeholder="Address" />

        <Button @click="addPatient" severity="success" label="Add Patient" />

        <div v-if="loading" class="text-cyan-400 text-lg mt-5">
            loading....
        </div>
    </div>

    <div class="mt-10 ml-20">
        <div v-if="patients" class="text-2xl"> Patients: </div>
        <div v-for="patient in patients" class="text-lg">
            <span class="text-green-400">
                {{ patient.firstName }} 
                {{ patient.middleName }} 
                {{ patient.lastName }}
            </span> 
            - {{ patient.address }}
        </div>
    </div>
</template>

<script setup lang="ts">
const patients = ref([]);
const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const address = ref('');
const loading = ref(false);



const addPatient = async () => {
    loading.value = true

    try {
        const response = await $fetch('/api/patient/add', {
            method: 'POST',
            body: {
                firstName: firstName.value,
                middleName:  middleName.value,
                lastName: lastName.value,
                address: address.value
            }
        })  

        console.log(response.data);
        fetchPatients();
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}

const fetchPatients = async () => {
    loading.value = true;
    const { data, error } = await useFetch("/api/patient/get-all-patients");
    patients.value = data.value;
    loading.value = false;
}

onMounted(() => {
    fetchPatients();
})


</script>
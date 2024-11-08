<template>
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

            <div>
                Patients: {{ patients }}
            </div>
            <div>
                Test: {{ test }}
            </div>

        </div>
</template>
</template>

<script setup lang="ts">
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

        console.log(response.data)
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}

const { data: patients, error } = await useFetch("/api/patient/get-all-patients");
const { data: test } = await useFetch(`/api/expenses/2`);


</script>
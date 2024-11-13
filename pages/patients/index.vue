<template>
    <div class="flex justify-center text-3xl mt-10">
        Patients Page
    </div>
        
    <div class="card flex justify-end mr-12">
        <Button @click="showPatientModal()" type="button" label="Add Patient" icon="pi pi-plus" />
    </div>

    <Dialog v-model:visible="visible" modal header="Add Patient" :style="{ width: '50rem' }">
        <addPatientForm />

    </Dialog>
</template>

<script setup lang="ts">
import addPatientForm from '@/components/Forms/addPatientForm.vue';


const patients = ref([]);
const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const address = ref('');
const loading = ref(false);
const visible = ref(false);


const fetchAllPatients = async () => {
    loading.value = true;
    const { data, error } = await useFetch("/api/patient/get-all-patients");
    patients.value = data.value;
    loading.value = false;
}

const showPatientModal = () => {
    visible.value = true;
    return null;
}

onMounted(() => {
    fetchAllPatients();
});
</script>

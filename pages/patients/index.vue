<template>
    <div class="flex justify-center text-3xl mt-10">
        Patients Page
    </div>

    <div class="card flex justify-end mr-12">
        <Button @click="showPatientModal()" type="button" label="Add Patient" icon="pi pi-plus" />
    </div>

    <div v-if="loading" class="flex justify-center">
        Loading...
    </div>

    <!-- {{ session.data.session?.access_token }} -->

    <div class="flex justify-center mt-10">
        <DataTable :value="patients" stripedRows tableStyle="min-width: 50rem">
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">Patients</span>
                    <Button @click="fetchAllPatients()" label="Refresh Table" />
                </div>
            </template>

            <Column header="Name">
                <template #body="slotProps">
                    {{ slotProps.data.firstName }}
                    {{ slotProps.data.middleName }}
                    {{ slotProps.data.lastName }}
                </template>
            </Column>

            <Column header="Gender">
                <template #body="slotProps">
                    {{ slotProps.data.gender === 'M' ? 'Male' : (slotProps.data.gender === 'M' ? 'Female' : 'Unknown') }}
                </template>
            </Column>

            <Column header="Contact Number">
                <template #body="slotProps">
                    {{ slotProps.data.contactNumber }}
                </template>
            </Column>

            <Column header="Address">
                <template #body="slotProps">
                    {{ slotProps.data.address }}
                </template>
            </Column>

            <Column header="Action">
                <template #body="slotProps">
                    <Button @click="updatePatient(slotProps.data)" label="Update" class="text-sm"/>
                    <Button @click="deletePatient(slotProps.data.id)" label="Delete" class="text-sm ml-2"/>
                </template>
            </Column>
        </DataTable>
    </div>
        

    <Dialog v-model:visible="visible" modal header="Add Patient" :style="{ width: '50rem' }">
        <addPatientForm :action="formAction" :formData="patientForm"
            @processDone="resetPatientForm(), fetchAllPatients()"/>
    </Dialog>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { useBadgeStore } from '@/stores/notificationStore';

import addPatientForm from '~/components/Forms/patientForm.vue';

const badgeStore = useBadgeStore();

const patients = ref();
const formAction = ref();
const patientForm = ref({
    id: null,
    firstName: null,
    lastName: null,
    middleName: null,
    address: null,
    gender: null,
    contactNumber: null,
    birthdate: null,
});

const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const address = ref('');
const loading = ref(false);
const visible = ref(false);
const database_jwt = ref();

const supabase = useSupabaseClient()
const session = await supabase.auth.getSession();


const fetchAllPatients = async () => {
    badgeStore.fetchBadgeCount();
    console.log('Badge Count:')
    console.log(badgeStore.getBadgeCount('patients'));


    loading.value = true;

    const { data, error } = await useFetch("/api/patient/get-all-patients"); 

    if (error.value) {
        console.error("Error fetching patients:", error.value);
    } else {
        patients.value = data.value; 
    }
    loading.value = false;
};

const updatePatient = (data: Number) => {
    formAction.value = 'update';
    patientForm.value.id = data.id;
    patientForm.value.firstName = data.firstName;
    patientForm.value.middleName = data.middleName;
    patientForm.value.lastName = data.lastName;
    patientForm.value.address = data.address;
    patientForm.value.gender = data.gender;
    patientForm.value.contactNumber = data.contactNumber;
    patientForm.value.birthdate = data.birthdate;
    visible.value = true;
}

const resetPatientForm = () => {
    formAction.value = null;
    patientForm.value.id = null;
    patientForm.value.firstName = null;
    patientForm.value.middleName = null;
    patientForm.value.lastName = null;
    patientForm.value.address = null;
    patientForm.value.gender = null;
    patientForm.value.contactNumber = null;
    patientForm.value.birthdate = null;
    visible.value = false;
}

const deletePatient = async (id: Number) => {
    try {
        console.log('Delete call')
        const { data, error } = await $fetch("/api/patient/delete", {
            method: 'POST',
            body: { id: id }
        }); 

        fetchAllPatients();
        
    } catch (error) {
        console.log(error);
        
    }
    
}

const showPatientModal = () => {
    formAction.value = "insert";
    visible.value = true;
    fetchAllPatients();
}

const closeModal = () => {
    visible.value = false;
    fetchAllPatients();
}

onMounted(async () => {
    await nextTick();
    await fetchAllPatients();
});
</script>

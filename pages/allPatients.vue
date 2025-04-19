<template>
    <div class="w-full">

        <div class="flex items-center justify-end gap-4">
            <div>Filter By:</div>
            <Button type="button" label="Due Date" severity="warning"/>
            <Button type="button" label="Ongoing" severity="info"/>
            <Button type="button" label="In Queue" severity="success"/>
            <Button type="button" label="Finished" severity="help"/>
        </div>
        <div class="flex justify-center text-sm mt-10">
            <DataTable :value="patients" stripedRows size="small" tableStyle="min-width: 70rem; border-radius: 10px;">
                <template #header>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xl font-bold">All Patients</span>
                        <div class="card flex justify-end">
                            <Button @click="showPatientModal()" type="button" label="Add Patient" class="add-button"/>
                        </div>
                    </div>
                </template>
    
                <Column header="Name">
                    <template #body="slotProps">
                        {{ slotProps.data.firstName }}
                        {{ slotProps.data.middleName }}
                        {{ slotProps.data.lastName }}

                        <Badge value="Custom" class="special-badge ml-3"></Badge>
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
    
                <Column header="Action" style="width: 15%;">
                    <template #body="slotProps">
                        <SplitButton label="Actions" @click="save" :model="actions(slotProps.data)" rounded severity="info"/>
                        <!-- <Button @click="updatePatient(slotProps.data)" label="Update" class="text-sm"/>
                        <Button @click="deletePatient(slotProps.data.id)" label="Delete" class="text-sm ml-2"/> -->
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
        
    <Dialog v-model:visible="visible" modal header="Add Patient" :style="{ width: '50rem' }">
        <addPatientForm :action="formAction" :formData="patientForm"
            @processDone="resetPatientForm(), fetchAllPatients()"/>
    </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
})


import { nextTick } from 'vue';
import { useBadgeStore } from '@/stores/notificationStore';

import addPatientForm from '~/components/Forms/patientForm.vue';

const badgeStore = useBadgeStore();

type PatientFormType = typeof patientForm.value;

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

const updatePatient = (data: Partial<PatientFormType>) => {
    formAction.value = 'update';
    patientForm.value.id = data.id ?? null;
    patientForm.value.firstName = data.firstName ?? null;
    patientForm.value.middleName = data.middleName ?? null;
    patientForm.value.lastName = data.lastName ?? null;
    patientForm.value.address = data.address ?? null;
    patientForm.value.gender = data.gender ?? null;
    patientForm.value.contactNumber = data.contactNumber ?? null;
    patientForm.value.birthdate = data.birthdate ?? null;
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
        await $fetch("/api/patient/delete", {
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

const actions = (data: Partial<PatientFormType>) => [
    {
        label: 'Update',
        command: () => {
            console.log('Update');
            console.log(data);
            updatePatient(data)
        }
    },
    {
        label: 'Delete',
        command: () => {
            console.log('Delete');
            deletePatient(data.id)
        }
    },
]

// notification or default function for action
const save = () => {
    console.log('Action trigger');
    // toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};

onMounted(async () => {
    await nextTick();
    await fetchAllPatients();
});
</script>

<style lang="css" scoped>
.special-badge {
    --p-badge-border-radius: 4px;
    --p-badge-padding: 4px;
    --p-badge-font-size: 0.6rem;
    --p-badge-font-weight: normal;
    --p-badge-primary-background: #60a5fa;
}
</style>

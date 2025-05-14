<template>
    <div class="w-full">
        <div class="flex items-center justify-end gap-4">
            <div>Filter By:</div>
            <Button type="button" label="Due Date" severity="warning"/>
            <Button type="button" label="Ongoing" severity="info"/>
            <Button type="button" label="In Queue" severity="success"/>
            <Button type="button" label="Finished" severity="help"/>
        </div>
        <div class="w-full flex flex-wrap justify-center text-sm mt-5 overflow-x-auto">
            <DataTable 
                :value="patients" 
                @row-click="onRowClick" 
                size="small" stripedRows 
                class="w-full max-w-[70rem] min-w-[30rem] rounded-full">

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
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading" class="flex justify-center items-center gap-4 mt-4">
        <button 
            @click="currentPage--; fetchAllPatients()" 
            :disabled="currentPage === 0 || loading"
            class="px-3 py-1 border rounded disabled:opacity-50"
        >
            <i class="pi pi-angle-left"></i>
            Previous
        </button>

        <span>Page {{ currentPage + 1 }}</span>

        <button 
            @click="currentPage++; fetchAllPatients()" 
            :disabled="!hasNextPage || loading"
            class="px-3 py-1 border rounded disabled:opacity-50"
        >
            Next
            <i class="pi pi-angle-right"></i>
        </button>
    </div>
        
    <Dialog v-model:visible="visible" modal header="Add Patient" :style="{ width: '60rem' }">
        <PatientForm 
            @processDone="resetPatientForm(), fetchAllPatients()"
            :action="formAction" 
            :form="patientForm"
        />
    </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
})

import { nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useBadgeStore } from '@/stores/notificationStore';
import PatientForm from '~/components/Forms/PatientForm.vue';

const visitType = useVisitTypes();
const router = useRouter();
const badgeStore = useBadgeStore();

type PatientFormType = typeof patientForm.value;

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
    allergies: []
});

const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const address = ref('');
const loading = ref(true);
const visible = ref(false);
const database_jwt = ref();

const supabase = useSupabaseClient()
const session = await supabase.auth.getSession();

// fetch pagination
const patients = ref();
const itemsPerPage = ref(10);
const currentPage = ref(0);
const hasNextPage = ref(false);
const fetchAllPatients = async () => {
    try {
        loading.value = true;

        // Refresh badge count first
        await badgeStore.fetchBadgeCount();
        const patientBadgeCount = badgeStore.getBadgeCount('patients');
        console.log('Patient Badge Count:', patientBadgeCount);

        // Fetch patients
        const offset = (currentPage.value * itemsPerPage.value); 
        const limit = itemsPerPage.value + 1;
        const params = new URLSearchParams({ 
            itemsPerPage: limit.toString(), 
            offset: offset.toString() 
        }).toString();

        const { data, error } = await useFetch(`/api/patient/details/get-all-patients?${params}`);

        if (error.value) {
            throw new Error(error.value.message || "Failed to fetch patients.");
        }

        console.log(itemsPerPage.value + 1);
        console.log(data.value?.length);

        // check if there will be a next page for table
        if (data.value?.length === itemsPerPage.value + 1) {
            hasNextPage.value = true;
            data.value.pop();
        } else{
            hasNextPage.value = false;
        }

        patients.value = data.value ?? [];
    } catch (err) {
        console.error("Error fetching patients:", err.message);
    } finally {
        loading.value = false;
    }
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
    patientForm.value.allergies = data.allergies ?? [];
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
        await $fetch("/api/patient/details/delete", {
            method: 'GET',
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
    Swal.fire({
        title: 'Success!',
        text: 'Your data has been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
    });
};

const onRowClick = (event: any) => {
  const rowData = event.data;
  
  console.log('Row clicked:', rowData);
  router.push(`/patients/${rowData.id}`);
}

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

.p-datatable {
  @apply rounded-xl overflow-hidden;
}
</style>

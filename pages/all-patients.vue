<template>
    <div class="card flex justify-end mb-2">
        <Button 
            @click="showPatientModal()" 
            type="button" 
            icon="pi pi-plus-circle" 
            label="Add Patient"
        />
    </div>

    <div class="w-full flex flex-wrap justify-center text-sm overflow-x-auto">
        <DataTable 
            :value="patients" 
            :loading="loading"
            @row-click="onRowClick" 
            size="small" stripedRows 
            class="w-full max-w-[80rem] min-w-[30rem] rounded-full">

            <template #header>
                <div class="flex flex-row justify-between">
                    <div class="text-xl font-bold">
                        All Patients
                    </div>
    
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText 
                            v-model="searchValue" 
                            @keydown.enter="triggerSearch" 
                            placeholder="Search" 
                            size="small"
                        />
                    </IconField>
                </div>
                
            </template>

            <template #loading> 
                <div class="text-xl text-white mt-10">
                    Fetching all patient's data. Please wait.. 
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                </div>
            </template>

            <template #empty> 
                <div v-if="!loading" class="text-center text-zinc-100 opacity-70 py-2">
                    No patient found.
                </div> 
                <div v-else>
                    <br/> <br/> <br/>
                </div>
            </template>

            <Column header="Name">
                <template #body="{ data }">
                    <Avatar 
                        :image="getRandomAvatar(data.gender)"
                        shape="circle" 
                        class="mr-2" style="background-color: #bae6fd; color: #2a1261" 
                    />

                    {{ data.firstName }}
                    {{ data.middleName ? data.middleName?.charAt(0).toUpperCase() + '.' : '' }}
                    {{ data.lastName }}

                    <i 
                        v-if="data.gender === 'M'"
                        class="pi pi-mars text-blue-500" 
                        style="font-size: 1.2rem">
                    </i>
                    <i 
                        v-else-if="data.gender === 'F'"
                        class="pi pi-venus text-pink-500" 
                        style="font-size: 1.2rem">
                    </i>

                    <template v-if="data.status">
                        <Badge 
                            v-if="data.status == 'in_queue'" 
                            value="IN QUEUE" 
                            class="special-badge bg-orange-400 text-white ml-3">
                        </Badge>

                        <Badge 
                            v-else-if="data.status == 'open'" 
                            value="OPEN" 
                            class="special-badge bg-blue-400 text-white ml-3">
                        </Badge>

                        <Badge 
                            v-else-if="data.status == 'in_progress'" 
                            value="IN PROGRESS" 
                            class="special-badge bg-gree-400 text-white ml-3">
                        </Badge>
                    </template>
                </template>
            </Column>

            <Column header="Age">
                <template #body="{ data }">
                    <template v-if="data.birthdate">
                        {{ computeAge(data.birthdate) }}
                    </template>
                    <template v-else>
                        <i class="pi pi-question" style="color: gray"></i>
                    </template>
                </template>
            </Column>

            <Column header="Last Visit">
                <template #body="{ data }">
                    <Badge v-if="data.latestVisit" class="bg-cyan-400 text-white text-[0.5rem] py-0 px-1">
                        {{ describeDateGap(data.latestVisit) }}
                    </Badge>
                    <Badge v-else class="bg-gray-400 text-white text-[0.55rem]">
                        None
                    </Badge>
                </template>
            </Column>

            <Column header="Address">
                <template #body="slotProps">
                    {{ slotProps.data.address }}
                </template>
            </Column>

            <Column header="Action" style="width: 15%;">
                <template #body="slotProps">
                    <SplitButton :model="actions(slotProps.data)" label="Actions" severity="info" size="small" rounded class="text-xs px-2 py-0"/>
                </template>
            </Column>

            <!-- Pagination -->
            <template #footer>
                <div v-if="!loading" class="flex justify-center items-center gap-4">
                    <button 
                        @click="currentPage--; fetchAllPatients()" 
                        :disabled="currentPage === 0 || loading"
                        class="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        <div class="flex flex-row justify-center items-center">
                            <i class="pi pi-angle-left"></i>
                            <div>Previous</div>
                        </div>
                    </button>

                    <span>Page {{ currentPage + 1 }}</span>

                    <button 
                        @click="currentPage++; fetchAllPatients()" 
                        :disabled="!hasNextPage || loading"
                        class="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        <div class="flex flex-row justify-center items-center">
                            <div> Next </div>
                            <i class="pi pi-angle-right"></i>
                        </div>
                    </button>
                </div>
            </template>
        </DataTable>
    </div>
        
    <Dialog 
        v-model:visible="visible" 
        :header="formAction === 'update' ? 'Update Patient' : 'Add Patient'" 
        :style="{ width: '60rem' }" modal>

        <PatientForm 
            @processDone="handleSuccess"
            :action="formAction" 
            :form="patientForm"
        />
    </Dialog>

    <Dialog 
        v-model:visible="showQueueModal" 
        header="Add to Queue" 
        :style="{ width: '30rem' }" modal>

       <QueueForm 
        @queueSuccess="queueSuccess()" 
        :form="queueForm" 
        :doctors="doctors"
        />
    </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
})

import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { useBadgeStore } from '@/stores/notificationStore'
import PatientForm from '@/components/forms/PatientForm.vue'
import QueueForm from '@/components/forms/QueueForm.vue'
import { computeAge, describeDateGap  } from '@/utils/helpers'

const user = useUserStore();
const supabaseUser = useSupabaseUser();


const { success, errorNotification } = useNotification();
const { visitTypes } = useConstants();
const router = useRouter();
const badgeStore = useBadgeStore();

type PatientFormType = typeof patientForm.value;

interface QueueType {
  id: number | null;
  reason: string | null;
  companion: string | null;
  doctor: {
    id: number|null,
    fullname: string|null
  };
  visitType: {
    name: string|null,
    value: string|null
  };
}

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
    allergies: [],
    occupation: null,
    status: ''
});


const loading = ref(true);
const visible = ref(false);

const supabase = useSupabaseClient()
const session = await supabase.auth.getSession();

// fetch pagination
const patients = ref();
const itemsPerPage = ref(10);
const currentPage = ref(0);
const hasNextPage = ref(false);
const searchValue = ref<string>('');

const onRowClick = (event: any) => {
  const rowData = event.data;
  
  router.push(`/patient/${rowData.id}`);
}

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
            offset: offset.toString(),
            searchValue: searchValue.value
        }).toString();

        const response = await $fetch(`/api/patient/details/get-all-patients?${params}`);

        // check if there will be a next page for table
        if (response?.data?.length === itemsPerPage.value + 1) {
            hasNextPage.value = true;
            response.data.pop();
        } else{
            hasNextPage.value = false;
        }

        patients.value = response.data ?? [];
    } catch (err) {
        console.error("Error fetching patients:", err.message);
        throw new Error(err.message || "Failed to fetch patients.");
    } finally {
        loading.value = false;
    }
};

const triggerSearch = () => {
    if (searchValue.value.length >= 3) {
        fetchAllPatients();
    } else {
        errorNotification('Type three or more characters to search patients.')
    }
}

// get all doctors
const doctors = ref([]);
const fetchAllDoctors = async () => {
    try {
        const response = await $fetch(`/api/users/get-all-doctors`);
        doctors.value = response.data ?? [];
    } catch (error) {
        throw new Error(error.message || "Failed to fetch doctors.");
    }
}


const handleUpdate = (data: Partial<PatientFormType>) => {
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
    patientForm.value.occupation = data.occupation ?? null;
    patientForm.value.status = data.status ?? null;
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
    patientForm.value.occupation = null;
    patientForm.value.allergies = [];
    visible.value = false;
}

const handleDelete = async (id: number) => {
    try {
        await $fetch("/api/patient/details/delete", { body: { id: id } }); 

        fetchAllPatients();
    } catch (error) {
        error('Unexpected error has occured.');
    }
}

const showPatientModal = () => {
    formAction.value = "insert";
    visible.value = true;
    fetchAllPatients();
}

const  actions = (data: Partial<PatientFormType>) => {
  const baseActions = [
    {
      label: 'Update',
      icon: 'pi pi-pencil',
      command: () => handleUpdate(data),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => handleDelete(data.id),
    },
  ];

  if (!data.status) {
    baseActions.unshift({
      label: 'Add to Queue',
      icon: 'pi pi-plus',
      command: () => handleAddToQueue(data.id),
    });
  }

  return baseActions;
}

const handleSuccess = (action: string) => {
    const message = action === 'add' ? 'Patient has been added.' : 'Patient has been updated.';
    success(message);

    resetPatientForm();
    fetchAllPatients();
}

// for patient queue
const visitType = ref();
const showQueueModal = ref(false);

const queueForm = ref<QueueType>({
    id: null,
    visitType: {
        name: null,
        value: null
    },
    caseCategory: {
        name: null,
        value: null
    },
    reason: null,
    doctor: {
        id: null,
        fullname: null
    },    
    companion: null
})

const resetQueueData = () => {
    queueForm.value.id = null;
    queueForm.value.reason = null;
    queueForm.value.companion = null;
    queueForm.value.visitType = {
        name: null,
        value: null
    };
    queueForm.value.doctor = {
        id: null,
        fullname: null
    };
}

const handleAddToQueue = (id: number) => {
    queueForm.value.id = id;
    showQueueModal.value = true;
}

const queueSuccess = () => {
    showQueueModal.value = false;
    fetchAllPatients();
}

const getRandomAvatar = (gender: string) => {
  const id = Math.floor(Math.random() * 99) + 1
  const selectedGender = gender === 'F' ? 'women' : (gender === 'M' ? 'men' : Math.random() > 0.5 ? 'men' : 'women')
  return `https://randomuser.me/api/portraits/${selectedGender}/${id}.jpg`
}

onMounted(async () => {
    await nextTick();
    fetchAllPatients();
    fetchAllDoctors();
});
</script>

<style lang="css" scoped>
.special-badge {
    --p-badge-border-radius: 4px;
    --p-badge-padding: 4px;
    --p-badge-font-size: 0.6rem;
    --p-badge-font-weight: normal;
}
</style>

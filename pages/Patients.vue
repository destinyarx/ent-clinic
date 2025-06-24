<template>
    <div class="flex justify-end mb-2">
        <Button
            @click="showPendingModal = true" 
            :badge="pendingPatientsCount ? pendingPatientsCount.toString() : undefined" 
            type="button" 
            label="Pending Patients" 
            icon="pi pi-users" 
            badgeSeverity="danger" 
            variant="primary"  
        />
    </div>
    <div class="flex justify-center w-full">
        <DataTable 
        @row-click="onRowClick"
        :value="patients" 
        :loading="loading"
        size="small" stripedRows
        class="w-full max-w-[80rem] min-w-[30rem] rounded-full"
        >
            <template #header>
                <div class="flex flex-wrap items-center justify-between max-w-[95vw] gap-2">
                    <span class="text-xl font-bold">Patients</span>

                    <div class="flex flex-row gap-2 max-w-[70%]">
                        <MultiSelect 
                            v-model="filterByStatus" 
                            @change="fetchData"
                            :options="visitTypes"
                            display="chip" 
                            optionLabel="name" 
                            placeholder="Filter by Types"
                            size="small"
                        >
                            <template #option="slotProps">
                                <div class="flex items-center text-sm">
                                    {{ slotProps.option.name }}
                                </div>
                            </template>
                        </MultiSelect>

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
                </div>
            </template>
    
            <template #loading> 
                <div class="text-xl text-white mt-10">
                    Fetching patient's data. Please wait.. 
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
    
            <Column header="Name" style="width: 30%;">
                <template #body="{ data }">
                    <span class="text-sm ml-1">
                        {{ data.patientsFullName }}
                    </span>
                </template>
            </Column>
    
            <Column header="Age" style="width: 5%;">
                <template #body="{ data }">
                    <span class="text-sm ml-1">
                        {{ computeAge(data.birthdate) }}
                    </span>
                </template>
            </Column>
    
            <Column header="Visit Type" style="width: 15%;">
                <template #body="{ data }">
                    <Badge :class="badgeColor(data.visitType)">
                        {{ data.visitType }}
                    </Badge>
                </template>
            </Column>
    
            <Column header="Assigned To" style="width: 20%;">
                <template #body="{ data }">
                    <Badge severity="info" class="px-2 py-0">
                        <div class="flex flex-row items-center">
                            <i class="pi pi-user text-white text-[0.75rem]"></i>
                            <div class="text-white text-[0.65rem] ml-2">
                                {{ user?.profile?.id && data.doctorsId === user.profile.id ? 'Me' :  data.doctorsFullName }}
                            </div>
                        </div>
                    </Badge>
                </template>
            </Column>
    
            <Column header="Details">
                <template #body="{ data }">
                    <template v-if="data.examination_area">
                        <div class="font-semibold">Area of examination:</div>
                        <div class="italic mb-2">
                            {{ data.examination_area }}
                        </div>
                    </template>
    
                    <Badge class="bg-yellow-300 text-[0.55rem] px-1 py-0">
                        <span class="font-semibold">Started:&nbsp;</span>
                        {{ formatDateTime(data.startedAt) }}
                    </Badge>
                </template>
            </Column>
    
            <Column header="Action" style="width: 12%;">
                <template #body="{ data }">
                    <Button @click="finishVisit(data.patientId, data.id)" class="px-2 py-1">
                        <i class="pi pi-flag-fill text-white text-xs -mr-1"></i>
                        <span class="font-semibold text-[0.5rem]">Complete Visit</span>
                    </Button>
                </template>
            </Column>
    
            <template #footer v-if="!loading && patients.length">
                <div v-if="!loading && patients.length" class="flex justify-center items-center gap-4 text-sm mt-2">
                    <button 
                        @click="currentPage--; fetchData()" 
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
                        @click="currentPage++; fetchData()" 
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
        v-model:visible="showPendingModal" 
        header="Pending Patients"
        position="top" 
        :style="{ width: '60vw' }" modal>

       <PendingPatientsDT @closeAndRefresh="closeAndRefresh()"/>
    </Dialog>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

import PendingPatientsDT from '@/components/datatables/PendingPatientsDT.vue'
import { useUserStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computeAge } from '@/utils/helpers'
import { useDateFormatter } from '@/composables/useDateFormatter'

const user = useUserStore();
const router = useRouter();

const { success, errorNotification, confirmNotification } = useNotification()
const { formatDateTime } = useDateFormatter();
const { visitTypes } = useConstants();

// table
const patients = ref<any[]>([]);
const loading = ref<boolean>();
const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10;

// filters
const filterByStatus = ref<any>();
const searchValue = ref<string>('');
const showAssignedPatientsOnly = ref<boolean>(true);

// pending patients
const showPendingModal = ref<boolean>(false);

const onRowClick = (event: any) => {
  const rowData = event.data;
  router.push(`/patient/${rowData.id}`);
}

const formatTypeFilter = (filters: object[]) => {
    if (!filters.length) return null;

    return filters.map(item => String(item.name));
}

const fetchData = async () => {
    try {
        loading.value = true;

        // update badge count for pending patients
        getPendingPatientsCount();

        const response = await $fetch<{ success: boolean, data: any[], error?:string }>('api/patient/encounter/get-all', {
            params: { 
                offset: currentPage.value,
                itemsPerPage: itemsPerPage,
                doctor_id: showAssignedPatientsOnly.value ? user?.profile?.id : null, 
                status: 'in_progress',
                searchValue: searchValue.value,
                filterByVisitType: filterByStatus.value?.length ? formatTypeFilter(filterByStatus.value) : []
            }
        })

        // check if there will be a next page for table
        if (response.data?.length === itemsPerPage + 1) {
            hasNextPage.value = true;
            response.data.pop();
        } else{
            hasNextPage.value = false;
        }

        patients.value = response.data ?? [];
        
    } catch (error) {
        errorNotification('Unable to fetch data due to an unexpected error.')
    } finally {
        loading.value = false;
    }
}

const triggerSearch = () => {
    if (searchValue.value.length >= 3) {
        fetchData();
    } else {
        errorNotification('Type three or more characters to search patients.')
    }
}

const pendingPatientsCount = ref<number>(0);
const getPendingPatientsCount = async () => {
    const response = await $fetch<{ success: boolean, data: number, error?:string }>('api/patient/encounter/count-pending-patients', {
        params: { 
            doctor_id: user?.profile?.id, 
        }
    });

    pendingPatientsCount.value = response.data;

    if(response.error) {
        console.log(response.error);
    }
}

const finishVisit = async (patientId: number, encounterId: number) => {
    try {
        const confirm = await confirmNotification('You want to complete this patient visit?')

        if (!confirm) return;

        const response = await $fetch('api/patient/encounter/finish-visit', {
            method: 'POST',
            params: {
                patientId: patientId,
                encounterId: encounterId
            }
        })

        fetchData()
        success('Patient visit is successfully completed.')
    } catch (error) {
        console.log(error)
        errorNotification('Unexpected Error Occurs.')
    }
}

const closeAndRefresh = () => {
    fetchData();
    showPendingModal.value = false;
}

const badgeColor = (name: string) => {
  const match = visitTypes.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (!match) return '';

  return match.color;
}

onMounted(() => {
    fetchData();
})

</script>
<template>
    <DataTable 
    :value="patients" 
    size="small" stripedRows
    class="w-full max-w-[70rem] min-w-[30rem] rounded-full"
    >

        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Patients</span>

                <Button
                    @click="showPendingModal = true" 
                    :badge="'2'" 
                    type="button" 
                    label="Pending Patients" 
                    icon="pi pi-users" 
                    badgeSeverity="danger" 
                    variant="primary"  
                />
            </div>
        </template>

        <template #empty> 
            <div class="text-center text-zinc-100 opacity-70 py-2">
                No Active Patient.
            </div> 
        </template>

        <Column header="Name">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ data.patientsFullName }}
                </span>
            </template>
        </Column>

        <Column header="Age">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ computeAge(data.birthdate) }}
                </span>
            </template>
        </Column>

        <Column header="Visit Type">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ data.visitType }}
                </span>
            </template>
        </Column>

        <Column header="Assigned To">
            <template #body="{ data }">
                <Badge severity="info">
                    <div class="flex flex-row items-center">
                        <i class="pi pi-user text-white"></i>
                        <div class="text-white ml-2">
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
            </template>
        </Column>

        <Column header="Details">
            <template #body="{ data }">
                <Button class="text-xs">
                    <i class="pi pi-flag-fill text-white"></i>
                    <span class="font-semibold">Finish Visit</span>
                </Button>
            </template>
        </Column>

        <template #footer v-if="!loading && patients.length">
            <div v-if="!loading && patients.length" class="flex justify-center items-center gap-4">
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

    <Dialog 
        v-model:visible="showPendingModal" 
        header="Pending Patients"
        position="top" 
        :style="{ width: '60vw' }" modal>

       <PendingPatientsDT />
    </Dialog>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' });

import PendingPatientsDT from '@/components/Datatables/PendingPatientsDT.vue';
import { useUserStore } from '@/stores/authStore';
import { computeAge } from '@/utils/helpers';

const user = useUserStore();

// table
const patients = ref<any[]>([]);
const loading = ref<boolean>();
const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10;

// filters
const searchValue = ref<string>();
const filterStatus = ref<string|null>(null);
const showAssignedPatientsOnly = ref<boolean>(true);

// pending patients
const showPendingModal = ref<boolean>(false);

const fetchData = async () => {
    try {
        loading.value = true;
        const response = await $fetch<{ success: boolean, data: any[], error?:string }>('api/patient/encounter/get-all', {
            params: { 
                offset: currentPage.value,
                itemsPerPage: itemsPerPage,
                doctor_id: showAssignedPatientsOnly.value ? user?.profile?.id : null, 
                status: filterStatus.value
            }
        })

        if (response.error) {
            console.log(response.error);
            return;
        }

        // check if there will be a next page for table
        if (response.data?.length === itemsPerPage + 1) {
            hasNextPage.value = true;
            response.data.pop();
        } else{
            hasNextPage.value = false;
        }

        patients.value = response.data ?? [];
        
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchData();
})

</script>
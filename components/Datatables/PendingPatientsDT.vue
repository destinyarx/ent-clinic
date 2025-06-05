<template>
    <Datatable
    :value="patients" 
    size="small" stripedRows
    class="w-full rounded-full"
    >
        <template #empty> 
            <div class="text-center text-zinc-100 opacity-70 py-2">
                No Pending Patient.
            </div> 
        </template>

        <Column header="Name" style="width: 35%;">
            <template #body="{ data }">
                <span class="ml-1">
                    {{ data.patientsFullName }}
                </span>
            </template>
        </Column>

        <Column header="Age" style="width: 8%;">
            <template #body="{ data }">
                <span class="ml-1">
                    {{ computeAge(data.birthdate) }}
                </span>
            </template>
        </Column>

        <Column header="Visit Type" style="width: 12%;">
            <template #body="{ data }">
                <Badge :class="badgeColor(data.visitType)">
                    {{ data.visitType }}
                </Badge>
            </template>
        </Column>

        <Column header="Details">
            <template #body="{ data }">
                <template v-if="data.remarks">
                    <div class="font-semibold">Remarks:</div>
                    <div class="italic mb-2">
                        {{ data.remarks }}
                    </div>
                </template>

                <template v-if="data.examination_area">
                    <div class="font-semibold">Area of examination:</div>
                    <div class="italic mb-2">
                        {{ data.examination_area }}
                    </div>
                </template>
            </template>
        </Column>

        <Column header="Action"  style="width: 10%;">
            <template #body="{ data }">
                <div class="flex flex-col gap-1">
                    <Button @click="handleAction('accept', data.patientId, data.id)" size="small">
                        <i class="pi pi-check-circle"></i>
                        <span class="text-xs">
                            Accept
                        </span>
                    </Button>
    
                    <Button @click="handleAction('reject', data.patientId, data.id)" size="small" severity="danger">
                        <i class="pi pi-reply"></i>
                        <span class="text-xs">
                            Reject
                        </span>
                    </Button>
                </div>
            </template>
        </Column>
    </Datatable>
</template>

<script setup lang="ts">
import { computeAge } from '@/utils/helpers';
import { useUserStore } from '@/stores/authStore';

const emit = defineEmits(['closeAndRefresh'])

const user = useUserStore();
const { success, confirmNotification, errorNotification } = useNotification();
const { visitTypes } = useConstants();

type Patient = {
    name: string,
    age: number,
    doctor: {
        id: number,
        name: string
    }
}

const patients = ref<any[]>([]);
const loading = ref<boolean>();
const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10; 

const fetchData = async () => {
    try {
        loading.value = true;

        const response = await $fetch<{ success: boolean, data: any[], error?:string }>('api/patient/encounter/get-all', {
            params: { 
                offset: currentPage.value,
                itemsPerPage: itemsPerPage,
                doctor_id:  user?.profile?.id, 
                status: 'open'
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

const handleAction = async (action: string, patientId: number, id: number) => {
    const confirm = await confirmNotification('You want to accept this patient?');

    if (confirm) {
        const response = await $fetch<{ success: boolean, data: any[], error?:string }>('api/patient/encounter/update-status', {
            method: 'POST',
            params: { 
                patientId:  patientId, 
                id:  id, 
                status: action === 'accept' ? 'in_progress' : 'rejected'
            }
        })

        if (response?.error) {
            errorNotification('Error occured when updating the encounter status.');
            return;
        }

        emit('closeAndRefresh');
        success('Patient has been accepted.');
    }
}

const badgeColor = (name: string) => {
  const match = visitTypes.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (!match) return '';

  return match.color;
}

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.p-column-title {
  font-size: 0.5rem; /* adjust size as needed */
  font-weight: semibold;  /* optional */
}

</style>
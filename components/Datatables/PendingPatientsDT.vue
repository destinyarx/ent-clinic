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
                <span class="font-semibold ml-1">
                    {{ data.patientsFullName }}
                </span>
            </template>
        </Column>

        <Column header="Age" style="width: 8%;">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ computeAge(data.birthdate) }}
                </span>
            </template>
        </Column>

        <Column header="Visit Type" style="width: 12%;">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ data.visitType }}
                </span>
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
                    <Button size="small">
                        <i class="pi pi-check-circle"></i>
                        <span class="font-semibold text-xs">
                            Accept
                        </span>
                    </Button>
    
                    <Button size="small" severity="danger">
                        <i class="pi pi-reply"></i>
                        <span class="font-semibold text-xs">
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
const user = useUserStore();

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
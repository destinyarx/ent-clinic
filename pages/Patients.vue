<template>
    <DataTable 
    :value="patients" 
    size="small" stripedRows
    class="w-full max-w-[70rem] min-w-[30rem] rounded-full">

        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Patients</span>

                <Button
                    @click="showPendingModal = true" 
                    type="button" 
                    label="Pending Patients" 
                    icon="pi pi-users" 
                    badge="2" 
                    badgeSeverity="info" 
                    variant="primary"  
                />
            </div>
        </template>

        <template #empty> 
            <div class="text-center text-zinc-100 opacity-70 py-2">
                No patient in queue.
            </div> 
        </template>

        <Column template="Name">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ data.fullname }}
                </span>
            </template>
        </Column>

        <Column template="Age">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ data.age }}
                </span>
            </template>
        </Column>

        <Column template="Visit Type">
            <template #body="{ data }">
                <span class="font-semibold ml-1">
                    {{ data.visitType }}
                </span>
            </template>
        </Column>

        <Column template="Details">
            <template #body="{ data }">
                <div class="font-semibold">Area of examination:</div>
                <div class="italic mb-2">
                    {{ data.examination_area }}
                </div>
            </template>
        </Column>
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
definePageMeta({
    layout: 'authenticated-layout',
});

import PendingPatientsDT from '@/components/Datatables/PendingPatientsDT.vue';

// table
const patients = ref([]);
const loading = ref<boolean>();
const searchValue = ref<string>();
const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10;

// pending patients
const showPendingModal = ref<boolean>(false);

const fetchData = async () => {
    console.log('Mounted');
}

onMounted(() => {
    fetchData();
})

</script>
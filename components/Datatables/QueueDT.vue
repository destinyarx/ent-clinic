<template>
    <div class="w-full flex flex-wrap justify-center overflow-x-auto text-sm text-white mt-5">
        <DataTable 
            :value="queueList" 
            size="small" stripedRows
            class="w-full max-w-[70rem] min-w-[30rem] rounded-full">

            <template #empty> 
                <div class="text-center text-zinc-100 opacity-70 py-2">
                    No patient in queue.
                </div> 
            </template>

            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">Patient Queue</span>
                </div>
            </template>

            <Column header="#" style="width: 5%">
                <template #body="{ data }">
                    <span class="font-semibold ml-1">
                        {{ data.number }}
                    </span>
                </template>
            </Column>


            <Column header="Type" style="width: 15%">
                <template #body="{ data }">
                    <Badge :class="badgeColor(data.visitType)">
                        {{ data.visitType }}
                    </Badge>
                </template>
            </Column>

            <Column header="Name" style="width: 30%">
                <template #body="{ data }">
                    {{ data.patientFullName }}
                </template>
            </Column>

            <Column header="Doctor" style="width: 20%">
                <template #body="{ data }">
                    <Badge class="bg-blue-300">
                        <i class="pi pi-user mr-1"></i>
                        {{ data.doctorsFullName }}
                    </Badge>
                </template>
            </Column>

            <Column header="Details">
                <template #body="{ data }">
                    <div class="text-xs">
                        <template v-if="!data.remarks && !data.companion">
                            <Badge class="text-white bg-gray-700 italic">
                                No Information
                            </Badge> 
                        </template>
                        <template v-else>
                            <template v-if="data.remarks">
                                <div class="font-semibold">Remarks:</div>
                                <div class="italic mb-2">
                                    {{ data.remarks }}
                                </div>
                            </template>
        
                            <template v-if="data.companion">
                                <div class="font-semibold">Companion:</div>
                                <div class="italic">
                                    {{ data.companion }}
                                </div>
                            </template>
                        </template>
                    </div>
                    
                </template>
            </Column>

            <Column header="Actions" style="width: 10%;">
                <template #body="{ data }">
                    <SplitButton :model="actions(data)" size="small" label="Actions" severity="info" rounded/>
                </template>
            </Column>

            <!-- Pagination -->
            <template #footer>
                <div v-if="!loading && queueList?.length" class="flex justify-center items-center gap-4">
                    <button 
                        @click="currentPage--; fetchQueueList()" 
                        :disabled="currentPage === 0 || loading"
                        class="px-2 py-1 border rounded disabled:opacity-40"
                    >
                        <div class="flex flex-row justify-center items-center">
                            <i class="pi pi-angle-left"></i>
                            <div>Previous</div>
                        </div>
                    </button>

                    <span>Page {{ currentPage + 1 }}</span>

                    <button 
                        @click="currentPage++; fetchQueueList()" 
                        :disabled="!hasNextPage || loading"
                        class="px-2 py-1 border rounded disabled:opacity-40"
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
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/authStore';

const authUser = useUserStore();
const { visitTypes } = useConstants();
const { success, confirmNotification, errorNotification } = useNotification();

const queueList = ref<Object[]>();
const loading = ref<boolean>();
const searchValue = ref<string>();

const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10;

const fetchQueueList = async () => {
    try {
        loading.value = true;

        const offset = (currentPage.value * itemsPerPage); 
        const limit = itemsPerPage + 1;
        const params = new URLSearchParams({ 
            itemsPerPage: limit.toString(), 
            offset: offset.toString() 
        }).toString();

        const { data, error } = await $fetch(`/api/patient/queue/get-all-queue?${params}`);

        if (error) {
            throw new Error(error.value.message || "Failed to fetch queue list.");
        }

        // check if there will be a next page for table
        if (data.length === itemsPerPage + 1) {
            hasNextPage.value = true;
            data.pop();
        } else{
            hasNextPage.value = false;
        }

        queueList.value = data.map((item: any, index: number) => ({
            ...item,
            number: offset + index + 1
        }));

        console.log(queueList.value);

    } catch (err) {
        console.log(err instanceof Error ? err : new Error('Unknown fetch error'));
    } finally {
        loading.value = false;
    }
};

const  actions = (data: any) => {
  return [
    {
      label: 'Accept Patient',
      icon: 'pi pi-check-square',
      command: () => handleAccept(data),
    },
    {
      label: 'Update',
      icon: 'pi pi-pencil',
      command: () => handleUpdate(data),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => handleDelete(data.id, data.patientId),
    },
  ];
}

const handleAccept = async (data: any) => {
    const confirm = await confirmNotification('You want to accept this patient?');

    if (!confirm) return;

    try {
        const encounterDetails = {
            patientId: data.patientId,
            doctorId: data.doctorId,
            createdBy: authUser?.profile?.id,
            visitType: data.visitType,
            remarks: data.remarks,
        };

        await $fetch('/api/patient/encounter/add', {
            method: 'POST',
            body: { data: encounterDetails }
        });

        await $fetch('/api/patient/queue/delete', {
            method: 'PUT',
            body: { id: data.id }
        });

        await $fetch('/api/patient/details/update-patient-status', {
            method: 'PUT',
            body: { 
                id: data.patientId,
                status: 'open' 
            }
        });

        fetchQueueList();
    } catch (error) {
        errorNotification('Unexpected error occurs');
        console.log(error);
    }

    success('Patient successfully accepted.');
}

const handleUpdate = async (data: any) => {
    const confirm = await confirmNotification('You want to accept this patient?');

    if (!confirm) return;

    // TODO: finish update queue details

    success('Patient queue details successfully updated.');
}

const handleDelete = async (id: number, patientId: number) => {
    const confirm = await confirmNotification('You want to remove this patient from queue?');

    if (!confirm) return;

    try {
        await $fetch('/api/patient/queue/delete', {
            method: 'PUT',
            body: { id: id }
        });

        await $fetch('/api/patient/details/update-patient-status', {
            method: 'PUT',
            body: { 
                id: patientId,
                status: '' 
            }
        });

        fetchQueueList();
    } catch (error) {
        console.log(error);
        errorNotification('Unexpected error occurs.');
    }

    success('Patient successfully removed from queue.');
}

const badgeColor = (name: string) => {
  const match = visitTypes.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (!match) return '';

  return match.color;
}

onMounted(async () => {
    await fetchQueueList();
})
</script>

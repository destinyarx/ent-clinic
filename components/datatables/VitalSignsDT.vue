<template>
    <Datatable  
        :value="vitals" 
        :loading="loading"
        size="small" stripedRows 
        class="w-full max-w-[80rem] min-w-[30rem] rounded-full"
    >
        <template #empty> 
            <div v-if="!loading" class="text-center text-zinc-100 opacity-70 py-2">
                No vital sign records found.
            </div> 
            <div v-else>
                <br/> <br/> <br/>
            </div>
        </template>

        <template #header> 
            <div class="flex flex-row justify-between">
                <div v-if="props.type !== 'history'" class="text-xl font-bold">
                    Vital Signs
                </div>
            </div>
        </template>

        <Column header="🩸 Blood Pressure" style="width: 19%;">
            <template #body="{ data }">
                <span v-if="data.systolic &&  data.diatolic">
                    {{ data.systolic }}/{{ data.diatolic }} 
                    <span class="text-xs">mmHg</span>
                </span>
            </template>
        </Column>

        <Column header="💓 Pulse Rate" style="width: 19%;">
            <template #body="{ data }">
                <div v-if="data.heartRate">
                    {{ data.heartRate }}
                    <span class="text-xs">bpm</span>
                </div>
            </template>
        </Column>

        <Column header="🌬️ Respiratory Rate" style="width: 19%;">
            <template #body="{ data }">
                <div v-if="data.respiratoryRate">
                    {{ data.respiratoryRate }}
                    <span class="text-[0.45rem]">breaths/min</span>
                </div>
            </template>
        </Column>

        <Column header="🌡️ Temperature" style="width: 19%;">
            <template #body="{ data }">
                <div v-if="data.temperature">
                    {{ data.temperature }}
                    <span>℃</span>
                </div>
            </template>
        </Column>

        <Column header="🫁 Saturation" style="width: 19%;">
            <template #body="{ data }">
                <div v-if="data.saturation">
                    {{ data.saturation }}
                    <span>%</span>
                </div>
            </template>
        </Column>

        <Column v-if="type !== 'history'" header="Actions" style="width: 5%;">
            <template #body="{ data }">
                <SplitButton :model="actions(data)" label="Actions" severity="info" size="small" rounded class="text-xs px-2 py-0"/>
            </template>
        </Column>

        <template #footer v-if="!loading && vitals?.length">
            <div v-if="!loading && vitals.length" class="flex justify-center items-center gap-4 text-sm mt-2">
                <Button 
                    @click="currentPage--; fetchData()" 
                    :disabled="currentPage === 0 || loading"
                    class="px-2 py-1 border rounded disabled:opacity-50"
                >
                    <div class="flex flex-row justify-center items-center">
                        <i class="pi pi-angle-left"></i>
                        <div>Previous</div>
                    </div>
                </Button>

                <span>Page {{ currentPage + 1 }}</span>

                <Button 
                    @click="currentPage++; fetchData()" 
                    :disabled="!hasNextPage || loading"
                    class="px-2 py-1 border rounded disabled:opacity-50"
                >
                    <div class="flex flex-row justify-center items-center">
                        <div> Next </div>
                        <i class="pi pi-angle-right"></i>
                    </div>
                </Button>
            </div>
        </template>

    </Datatable>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/helpers'
const { success, errorNotification, confirmNotification } = useNotification()

const showFormModal = ref<boolean>(false)
const vitals = ref<Object[]>()
const loading = ref<boolean>(false)
const hasNextPage = ref<boolean>(false)
const currentPage = ref<number>(0)
const itemsPerPage = 10;

const props = defineProps<{
    id: number,
    encounterId: number|null
    type: string,
}>()

const emit = defineEmits(['update'])

const fetchData = async () => {
    try {
        loading.value = true

        const response = await $fetch<{ success: boolean, data: any[], error?:string }>('/api/patient/vitals/get', {
            params: { 
                patientId: props.id,
                encounterId: props.encounterId,
                type: props.type,
                offset: currentPage.value,
                itemsPerPage: itemsPerPage,
            }
        })

        // check if there will be a next page for table
        if (response.data?.length === itemsPerPage + 1) {
            hasNextPage.value = true
            response.data.pop()
        } else{
            hasNextPage.value = false
        }

        vitals.value = response.data ?? []
        
    } catch (error) {
        errorNotification('Unexpected error when fetching vital signs.')
        console.log(error)
    } finally {
        loading.value = false
    }
}

const handleDelete = async (id: number) => {
    const confirm = await confirmNotification('Are you sure you want to delete this record?')

    if (!confirm) return

    try {
        await $fetch('/api/patient/vitals/delete', {
            method: 'PATCH',
            body: { id: id }
        });

        fetchData();
    } catch (error) {
        console.log(error);
        errorNotification('Unexpected error occurs.');
    }

    success('Patient successfully removed from queue.');
}

const  actions = (data: Object) => {
  const baseActions = [
    {
      label: 'Update',
      icon: 'pi pi-pencil',
      command: () => emit('update', data),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => handleDelete(data.id),
    },
  ];

  return baseActions;
}

onMounted(() => {
    fetchData()
})

defineExpose({ fetchData })
</script>
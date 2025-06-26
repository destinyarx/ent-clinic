<template>
    <DataTable 
            :value="encounters" 
            :loading="loading"
            size="small" stripedRows 
            class="w-full max-w-[80rem] min-w-[30rem] rounded-full">

            <template #empty> 
                <div v-if="!loading" class="text-center text-zinc-100 opacity-70 py-2">
                    This patient has no recorded encounters.
                </div> 
                <div v-else>
                    <br/> <br/> <br/>
                </div>
            </template>

            <template #header> 
                <div class="text-xl font-bold">
                    Encounter History
                </div>
            </template>

            <Column header="Length of Stay" style="width: 30%">
                <template #body="{ data }">
                    <div class="text-xs">
                        {{ formatDate(data.startedAt) }} - {{ formatDate(data.endedAt) }} 
                        <span class="italic">
                            ({{ calculateDateTimeGap(data.startedAt, data.endedAt) }})
                        </span>
                    </div>
                </template>
            </Column>

            <Column header="Visit Type" style="width: 10%">
                <template #body="{ data }">
                    <div class="text-sm italic">
                        {{ data.visitType }}
                    </div>
                </template>
            </Column>

            <Column header="Clinical Concern" style="width: 15%">
                <template #body="{ data }">
                    {{ data.category }}
                </template>
            </Column>

            <Column header="Assigned Doctor">
                <template #body="{ data }">
                    {{ data.doctorsFullName }}
                </template>
            </Column>

            <Column header="Remarks">
                <template #body="{ data }">
                    <div class="text-xs italic">
                        This patient is need of surgery
                        {{ data.remarks }}
                    </div>
                </template>
            </Column>

            <!-- Pagination -->
            <template #footer>
                <div v-if="!loading" class="flex justify-center items-center gap-4">
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
</template>

<script setup lang="ts">
import { formatDate, calculateDateTimeGap } from '@/utils/helpers'

const props = defineProps<{
    patient: {
        id: number,
        encounterId: number|null|undefined
    }
}>()

const encounters = ref<Object[]>()
const loading = ref<boolean>(false)
const hasNextPage = ref<boolean>(false)
const currentPage = ref<number>(0)
const itemsPerPage = 10

const fetchData = async () => {
    try {
        loading.value = true

        const response = await $fetch<{ success: boolean, data: any[], error?:string }>('/api/patient/encounter/get-history', {
            params: { 
                id: props.patient.id,
                offset: currentPage.value,
                itemsPerPage: itemsPerPage,
            }
        })

        if (response.error) {
            console.log(response.error)
            return
        }

        // check if there will be a next page for table
        if (response.data?.length === itemsPerPage + 1) {
            hasNextPage.value = true
            response.data.pop()
        } else{
            hasNextPage.value = false
        }

        encounters.value = response.data ?? []
        
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>
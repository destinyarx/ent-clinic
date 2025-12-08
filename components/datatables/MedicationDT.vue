<template>
    <Datatable
        :value="medications" 
        :loading="loading"
        size="small" stripedRows 
        class="w-full max-w-[80rem] min-w-[30rem] rounded-full"
    >
        <template #empty> 
            <div v-if="!loading" class="text-center text-zinc-100 opacity-70 py-2">
                Medication module is still under development.
            </div> 
            <div v-else>
                <br/> <br/> <br/>
            </div>
        </template>

        <template #header> 
            <div class="text-xl font-semibold">
                Medications 
            </div>
        </template>

        <Column header="Name" style="width: 40%;">
            <template #body="{ data }">
                {{data}}
            </template>
        </Column>

        <Column header="Type" style="width: 20%;">
            <template #body="{ data }">
                {{data}}
            </template>
        </Column>

        <Column header="Severity" style="width: 20%;">
            <template #body="{ data }">
                {{data}}
            </template>
        </Column>

        <Column header="Details" style="width: 20%;">
            <template #body="{ data }">
                {{data}}
            </template>
        </Column>
    </Datatable>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/helpers'
const { success, errorNotification, confirmNotification } = useNotification()

const showFormModal = ref<boolean>(false)
const medications = ref<Object[]>()
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

}

onMounted(() => {
    fetchData()
})
</script>

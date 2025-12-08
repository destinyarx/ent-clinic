<template>
     <div class="flex flex-row justify-end my-2 gap-2">
        <Button 
            @click="handleAddDiagnosis" 
            type="button" 
            icon="pi pi-plus-circle" 
            label="Add Diagnosis" 
            class="text-sm"
        />

        <Button 
            @click="showHistory = true" 
            type="button" 
            severity="warn"
            icon="pi pi-history" 
            label="Show History" 
            class="text-sm"
        />
    </div>

    <DiagnosisDt 
        :id="props.patient.id" 
        :encounterId="props.patient.encounterId" 
        type="default"
    />
</template>

<script setup lang="ts">
import DiagnosisDt from '@/components/datatables/DiagnosisDT.vue'

const props = defineProps<{
    patient: {
        id: number,
        encounterId: number|null
    }
}>()

const showHistory = ref()

const handleAddDiagnosis = () => {

}
</script>
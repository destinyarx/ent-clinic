<template>
   <MedicationDT 
       :id="props.patient.id" 
       :encounterId="props.patient.encounterId" 
       type="default"
   />
</template>

<script setup lang="ts">
import MedicationDT from '@/components/datatables/MedicationDT.vue'

const props = defineProps<{
   patient: {
       id: number,
       encounterId: number|null
   }
}>()

const showHistory = ref()

const handleAddMedication = () => {

}
</script>
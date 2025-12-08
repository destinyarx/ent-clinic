<template>
    <div class="flex flex-row justify-end my-2 gap-2">
       <Button 
           @click="handleAddMedication" 
           type="button" 
           icon="pi pi-plus-circle" 
           label="Add Medication" 
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
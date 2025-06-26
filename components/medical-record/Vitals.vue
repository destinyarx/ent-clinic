<template>
    <div class="flex flex-row justify-end my-2 gap-2">
        <Button 
            @click="handleAddVitals" 
            type="button" 
            icon="pi pi-plus-circle" 
            label="Add Vital Signs" 
            class="text-sm"
        />

        <Button 
            @click="modal.history = true" 
            type="button" 
            severity="warn"
            icon="pi pi-history" 
            label="Show History" 
            class="text-sm"
        />
    </div>

    <VitalSignsDt 
        ref="vitalSignTableRef" 
        @update="handleUpdate" 
        :id="props.patient.id" 
        :encounterId="props.patient.encounterId" 
        type="default"
    />

    <Dialog 
        v-model:visible="modal.history" 
        header="Vital Signs History" 
        style="width: 60rem;" 
        modal
    >
        <VitalSignsDt :id="props.patient.id" :encounterId="props.patient.encounterId" type="history"/>
    </Dialog>

    <Dialog 
        v-model:visible="modal.form" 
        header="Add Vital Signs" 
        style="width: 55rem;" 
        modal
    >
        <VitalSignForm :patient="props.patient" :form="form" @success="handleSuccess"/>
    </Dialog>
</template>

<script setup lang="ts">
import VitalSignsDt from '@/components/datatables/VitalSignsDT.vue'
import VitalSignForm from '@/components/forms/VitalSignForm.vue'

const { success } = useNotification()

interface Vitals {
    id: number|null,
    action: 'add'|'update',
    diatolic: number|null,
    systolic: number|null,
    heartRate: number|null,
    respiratoryRate: number|null,
    temperature: number|null,
    saturation: number|null,
    remarks: string|null
}

const props = defineProps<{
    patient: {
        id: number,
        encounterId: number|null
    }
}>()

const vitalSignTableRef = ref()

const modal = ref({
    history: false,
    form: false
})

const form = ref<Vitals>({
    id: null,
    action: 'add',
    diatolic: null,
    systolic: null,
    heartRate: null,
    respiratoryRate: null,
    temperature: null,
    saturation: null,
    remarks: null
})

const handleSuccess = () => {
    vitalSignTableRef.value?.fetchData()
    success('Vital sign successfully added')
    modal.value.form = false
}

const resetForm = () => {
    form.value.id = null
    form.value.diatolic = null
    form.value.systolic = null
    form.value.heartRate = null
    form.value.respiratoryRate = null
    form.value.temperature = null
    form.value.saturation = null
    form.value.remarks = null
}

const setFormValues = (data: Partial<Vitals>) => {
    form.value.id = data.id ?? null
    form.value.diatolic = data.diatolic ?? null
    form.value.systolic = data.systolic ?? null
    form.value.heartRate = data.heartRate ?? null
    form.value.respiratoryRate = data.respiratoryRate ?? null
    form.value.temperature = data.temperature ?? null
    form.value.saturation = data.saturation ?? null
    form.value.remarks = data.remarks ?? null
}

const handleAddVitals = () => {
    resetForm()
    form.value.action = 'add'
    modal.value.form = true
}

const handleUpdate = (data: Partial<Vitals>) => {
    form.value.action = 'update'
    setFormValues(data)
    modal.value.form = true
}

</script>
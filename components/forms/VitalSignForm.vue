<template>
    <form @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-5">
            <div class="flex flex-row gap-3 w-full">
                <div class="w-2/3">
                    <label class="text-sm font-light mb-1">Blood Pressure</label>
                    <InputGroup>
                        <InputNumber v-model="props.form.systolic" placeholder="Systolic" />
                        <InputGroupAddon>/</InputGroupAddon>
                        <InputNumber v-model="props.form.diatolic" placeholder="Diatolic" />
                        <InputGroupAddon class="text-xs">mmHg</InputGroupAddon>
                    </InputGroup>
                </div>
    
                <div class="w-1/3">
                    <label for="temperature" class="text-sm font-light mb-1">Temperature</label>
                    <InputGroup>
                        <InputGroupAddon>🌡️</InputGroupAddon>
                        <InputNumber v-model="props.form.temperature" :min="0" :max="50" :minFractionDigits="2" placeholder="Temperature" />
                        <InputGroupAddon>℃</InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
    
            <div class="flex flex-row gap-3 w-full">
                <div class="w-1/3">
                    <label for="temperature" class="text-sm font-light mb-1">Pulse Rate</label>
                    <InputGroup>
                        <InputGroupAddon>💓</InputGroupAddon>
                        <InputNumber v-model="props.form.heartRate" :min="0"  placeholder="Pulse Rate" />
                        <InputGroupAddon class="text-xs">bpm</InputGroupAddon>
                    </InputGroup>
                </div>
    
                <div class="w-1/3">
                    <label for="temperature" class="text-sm font-light mb-1">Respiratory Rate</label>
                    <InputGroup>
                        <InputGroupAddon>🌬️</InputGroupAddon>
                        <InputNumber v-model="props.form.respiratoryRate" :min="0"  placeholder="Respiratory Rate" />
                        <InputGroupAddon>
                            <span class="text-[0.5rem]">breaths/min</span>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
    
                <div class="w-1/3">
                    <label for="temperature" class="text-sm font-light mb-1">Saturation</label>
                    <InputGroup>
                        <InputGroupAddon>🫁</InputGroupAddon>
                        <InputNumber v-model="props.form.saturation" :min="0" :max="100"  placeholder="Saturation" />
                        <InputGroupAddon>%</InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
    
            <div>
                <label for="remarks" class="text-sm font-light mb-1">Remarks</label>
                <TextArea v-model="props.form.remarks" variant="filled" placeholder="Remarks" autoResize class="w-full"/>
            </div>
    
            <div v-if="props.form.action === 'add'" class="flex justify-center">
                <Button type="submit" label="Submit" class="text-sm"/>
            </div>
            <div v-else-if="props.form.action === 'update'" class="flex justify-center">
                <Button type="submit" label="Update" class="text-sm"/>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
const authUser = useUserStore();
const { success, errorNotification, confirmNotification } = useNotification()

interface Vitals {
    action: 'add' | 'update'
    diatolic: number|null,
    systolic: number|null,
    heartRate: number|null,
    respiratoryRate: number|null,
    temperature: number|null,
    saturation: number|null,
    remarks: string|null
}

interface Patient {
    id: number,
    encounterId: number|null
}

const props = defineProps<{
    patient: Patient,
    form: Vitals
}>()

const emit = defineEmits(['success'])

const prompt = {
    'add': 'You want to add this vital sign',
    'update': 'You want to update this record'
}

const validate = () => {


    return true
}

const handleSubmit = async () => {
    const action = props.form.action

    if (!validate()) return

    const confirm = await confirmNotification(prompt[action])
    if (!confirm) return

    if (action === 'add') {
        addVitalSign()
    } else if (action === 'update') {
        updateVitalSign()
    }
}

const addVitalSign = async () => {
    try {
        await $fetch('/api/patient/vitals/add', {
            method: 'POST',
            body: { 
                patient: props.patient,
                data: props.form,
                creator: authUser.profile?.id ?? null
            }
        });

        emit('success')
    } catch (error) {
        errorNotification('Unexpected error occured when add vital signs.')
        console.log(error)
    }
}

const updateVitalSign = async () => {
    try {
        await $fetch('/api/patient/vitals/update', {
            method: 'PUT',
            body: { 
                data: props.form,
                updatedBy: authUser.profile?.id ?? null
            }
        });

        emit('success')
    } catch (error) {
        errorNotification('Unexpected error occured when add vital signs.')
        console.log(error)
    }
}
</script>
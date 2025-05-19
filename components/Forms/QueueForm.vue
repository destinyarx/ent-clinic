<template>
    <div class="flex flex-col gap-4">
        <div>
            <label for="visit" class="text-sm font-light mb-1">Visit Type</label>
            <Select 
                v-model="props.form.visitType" 
                :options="visitTypes"
                name="visitTypes.name"  
                optionLabel="name" 
                placeholder="Patient Visit Types" 
                fluid
            />
        </div>

        <div>
            <label for="doctor" class="text-sm font-light mb-1">Assign to</label>
            <Select 
                v-model="props.form.visitType" 
                :options="visitTypes"
                name="visitTypes.name"  
                optionLabel="name" 
                placeholder="Patient Visit Types" 
                fluid
            />
        </div>
        
        <div>
            <label for="companion" class="text-sm font-light mb-1">Companion</label>
            <InputText v-model="props.form.companion" variant="filled" placeholder="Type name here" class="w-full"/>
        </div>

        <div>
            <label for="reason" class="text-sm font-light mb-1">Reason</label>
            <Textarea v-model="props.form.reason" rows="3" placeholder="Type visit reason here" cols="15" class="w-full"/>
        </div>
    </div>

    <div class="flex flex-row justify-end gap-3 mt-5">
        <Button @click="addToQueue" label="Add to Queue" severity="success"/>
    </div>
</template>

<script setup lang="ts">
const { visitTypes } = useConstants();

interface FormType {
    id: number | null,
    visitType: string | null,
    reason: string | null,
    assignedTo: number | null,
    companion: string | null,
}

const props = defineProps<{
    form: FormType
}>();

const addToQueue = async () => {

}
</script>

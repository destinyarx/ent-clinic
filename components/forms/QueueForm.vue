<template>
    <div class="flex flex-col gap-4">
        <div>
            <label for="visit" class="text-sm font-light mb-1">Visit Type</label>
            <Select 
                v-model="props.form.visitType" 
                :options="visitTypes"
                :invalid="errors.visitType"
                name="visitTypes.name"  
                optionLabel="name" 
                placeholder="Patient Visit Types" 
                fluid
            />
            <Message v-if="errors.visitType" size="small" severity="error" variant="simple">Visit type is a required field.</Message>
        </div>

        <div>
            <label for="visit" class="text-sm font-light mb-1">Case Category</label>
            <Select 
                v-model="props.form.caseCategory" 
                :options="anatomicalCategories"
                :invalid="errors.caseCategory"
                name="visitTypes.name"  
                optionLabel="name" 
                placeholder="Case Category" 
                fluid
            />
            <Message v-if="errors.caseCategory" size="small" severity="error" variant="simple">Visit type is a required field.</Message>
        </div>

        <div>
            <label for="doctor" class="text-sm font-light mb-1">Assign to</label>

            <AutoComplete
                v-model="props.form.doctor"
                @complete="searchDoctor"
                :suggestions="filteredDoctors"
                :optionLabel="(option) => option?.fullname || ''"
                placeholder="Select Assigned Doctor"
                class="w-full"
                dropdown
            >

                <template #option="slotProps">
                    <div class="flex items-center">
                        <div>Dr. {{ slotProps.option.fullname }}</div>
                    </div>
                </template>
            </AutoComplete>
            <Message v-if="errors.doctor" size="small" severity="error" variant="simple">Doctor is a required field.</Message>
        </div>
        
        <div>
            <label for="companion" class="text-sm font-light mb-1">Companion's Name</label>
            <InputText v-model="props.form.companion" variant="filled" placeholder="Type name here" class="w-full"/>
        </div>

        <div>
            <label for="reason" class="text-sm font-light mb-1">Reason</label>
            <Textarea v-model="props.form.reason" :invalid="errors.reason" rows="3" placeholder="Type visit reason here" cols="15" class="w-full"/>
        </div>
    </div>

    <div class="flex flex-row justify-end gap-3 mt-5">
        <Button @click="addToQueue()" label="Add to Queue" severity="success"/>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/authStore';

const emit = defineEmits(['queueSuccess']);

const authUser = useUserStore();
const { visitTypes, anatomicalCategories } = useConstants();
const { success, confirmNotification } = useNotification();

interface FormType {
    id: number | null,
    visitType: {
        name: string,
        value: string
    },
    caseCategory: {
        name: string,
        value: string
    },
    reason: string | null,
    doctor: {
        id: number,
        fullname: string
    },
    companion: string | null,
}

interface FormTypeErrors {
    visitType: boolean,
    caseCategory: boolean,
    doctor: boolean,
}

interface Doctor {
    id: number,
    fullname: string,
}

const props = defineProps<{
    form: FormType,
    doctors: Doctor[]
}>();

const errors = ref<FormTypeErrors>({
    visitType: false,
    caseCategory: false,
    doctor: false
});

const validateForm = () => {
    errors.value.visitType = !props.form.visitType?.name ? true : false;
    errors.value.caseCategory = !props.form.caseCategory?.name ? true : false;
    errors.value.doctor = !props.form.doctor?.id ? true : false;

    return !errors.value.visitType && !errors.value.doctor;
}

const addToQueue = async () => {
    if (!validateForm()) return;

    const confirm = await confirmNotification('You want to add this patient to queue?');

    if (!confirm) return;

    try {
        await $fetch('/api/patient/queue/add', {
            method: 'POST',
            body: { 
                data: {
                    ...props.form,
                    createdBy: authUser?.profile?.id,
                }, 
            }
        });

        await $fetch('/api/patient/details/update-patient-status', {
            method: 'PUT',
            body: { 
                id: props.form.id,
                status: 'in_queue' 
            }
        });

        success('Patient successfully added to queue.');
        emit('queueSuccess');
    } catch (error) {
        console.log(error);
    }
}

const filteredDoctors = ref<Doctor[]>([]);
const searchDoctor = (event: { query: string }) => {
    const searchValue = event.query.toLowerCase();

    filteredDoctors.value = props.doctors.filter(doctor =>
        doctor.fullname.toLowerCase().includes(searchValue)
    );
}
</script>

<template>
    <div class="flex flex-col w-full min-screen">
        <div class="flex flex-row items-center pb-2 mb-4 ">
            <div class="mr-2">
                <Avatar icon="pi pi-user" class="mr-2 h-24 w-24" size="xlarge" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            </div>

            <div class="flex flex-col justify-start items-start text-sm">
                <div class="font-semibold text-2xl mt-2">
                    {{ props.patient?.firstName }}
                    {{ props.patient?.middleName ? props.patient?.middleName.charAt(0).toUpperCase() + '.' : '' }}
                    {{ props.patient?.lastName }}
                </div>

                <div class="flex flex-row gap-2 mt-2">
                    <i 
                        v-if="props.patient?.gender === 'M'"
                        class="pi pi-mars text-blue-500" 
                        style="font-size: 1.2rem">
                    </i>

                    <i 
                        v-else-if="props.patient?.gender === 'F'"
                        class="pi pi-venus text-pink-500" 
                        style="font-size: 1.2rem">
                    </i>

                    {{ props.patient?.gender ? gender[props.patient.gender] : 'Unknown' }}
                </div>

                <div class="flex flex-row flex-wrap items-center mt-2">
                    <span class="font-semibold text-sm mr-2">
                        Allergies:
                    </span>

                    <template v-if="props.patient?.allergies?.length" >
                        <Badge v-for="(item, index) in props.patient.allergies" class="bg-gray-300 font-light mr-1">
                            {{ item }}
                        </Badge>
                    </template>

                    <template v-else>
                        <p class="italic">No allergies recorded.</p>
                    </template>
                </div>
            </div>
        </div>

        <div class="w-full">
            <slot></slot>
        </div>
    </div>

    
</template>

<script setup lang="ts">
const { id } = useRoute().params
const patient = ref<any>(null)
const loading = ref<boolean>(false)
const error   = ref<Error|null>(null)

interface Patient {
    firstName: string,
    middleName: string,
    lastName: string,
    gender: string,
    allergies: string[]
}

const props = defineProps<{ 
    patient: Patient | undefined
}>()

const gender = {
    'M': 'Male',
    'F': 'Female',
    'X': 'Unknown'
};

</script>

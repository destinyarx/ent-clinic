<template>
    <div class="flex flex-col w-full min-screen">
        <div class="flex flex-row items-center pb-2 mb-4 ">
            <div class="mr-2">
                <Avatar icon="pi pi-user" class="mr-2" size="xlarge" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            </div>

            <div class="flex flex-col justify-start items-start text-sm">
                <div class="mt-2">
                    <span class="font-bold text-sm">Name:</span>
                    {{ props.patient?.firstName }}
                    {{ props.patient?.middleName ? props.patient?.middleName.charAt(0) + '.' : '' }}
                    {{ props.patient?.lastName }}
                </div>

                <div class="mt-2">
                    <span class="font-bold text-sm">Gender:</span>
                    {{ props.patient?.gender ? gender[props.patient.gender] : 'Unknown' }}
                </div>

                <div class="flex flex-row flex-wrap mt-2">
                    <span class="font-semibold text-sm mr-2">
                        Allergies:
                    </span>

                    <template v-if="props.patient?.allergies?.length" >
                        <Badge v-for="(item, index) in props.patient.allergies" class="bg-neutral-300 mr-1">
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

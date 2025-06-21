<template>
    {{ user }}
    <Card>
        <template #header>
            <div class="flex flex-wrap flex-col gap-4 mb-5">
                <div class="flex flex-wrap flex-row">
                    <div class="flex flex-row flex-wrap w-[60%]">
                        <label class="text-sm font-light mb-1">
                            Name
                        </label>
                        <InputText v-model="user.name" variant="filled" class="w-full" placeholder="Name" disabled/>
                    </div>
        
                    <div class="flex flex-row flex-wrap w-[40%] pl-4">
                        <label class="text-sm font-light mb-1">
                            Email
                        </label>
                        <InputText v-model="user.email" variant="filled" class="w-full" placeholder="Email"/>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap flex-col gap-4 mb-5">
                <div class="flex flex-wrap flex-row">
                    <div class="flex flex-row flex-wrap w-[33%]">
                        <label class="text-sm font-light mb-1">
                            Birthdate
                        </label>
                        <DatePicker v-model="user.birthdate"  showIcon class="w-full text-base" placeholder="Birthdate"/>
                    </div>
        
                    <div class="flex flex-row flex-wrap w-[67%] pl-4">
                        <label class="text-sm font-light mb-1">
                            Area of Designation
                        </label>
                        <InputText v-model="user.designationArea"variant="filled" class="w-full" placeholder="Area of Designation"/>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap flex-col gap-4 mb-5">
                <div class="flex flex-wrap flex-row">
                    <div class="flex flex-row flex-wrap w-1/3">
                        <label class="text-sm font-light mb-1">
                            Role
                        </label>
                        <InputText v-model="user.role" variant="filled" class="w-full" placeholder="Role" disabled/>
                    </div>
        
                    <div class="flex flex-row flex-wrap w-1/3 pl-4">
                        <label class="text-sm font-light mb-1">
                            Position
                        </label>
                        <InputText v-model="user.position" variant="filled" class="w-full" placeholder="Position"/>
                    </div>

                    <div class="flex flex-row flex-wrap w-1/3 pl-4">
                        <label class="text-sm font-light mb-1">
                            License Number
                        </label>
                        <InputText v-model="user.licenseNumber" variant="filled" class="w-full" placeholder="License Number"/>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center mt-4">
                <Button @click="update" label="Update Profile" icon="pi pi-user-edit"/>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/authStore'

const emit = defineEmits(['success'])
const { success, errorNotification } = useNotification()
const authUser = useUserStore()

interface User {
    id: string|null,
    name: string|null,
    birthdate: Date|null,
    email: string|null,
    designationArea: string|null,
    role: string|null,
    position: string|null,
    licenseNumber: string|null,
}

const user = ref<User>({
    id: '',
    name: '',
    birthdate: null,
    email: '',
    designationArea: '',
    role: '',
    position: '',
    licenseNumber: '',
})

const loading = ref<boolean>(false)

const setValues = () => {
    user.value.id =  authUser.profile?.id ?? null
    user.value.name =  authUser.profile?.name ?? null
    user.value.birthdate =  authUser.profile?.birthdate ? new Date(authUser.profile.birthdate) : null
    user.value.email =  authUser.profile?.email ?? null
    user.value.designationArea =  authUser.profile?.designationArea ?? null
    user.value.role =  authUser.profile?.role ?? null
    user.value.position =  authUser.profile?.position ?? null
    user.value.licenseNumber =  authUser.profile?.licenseNumber ?? null
}

const update = async () => {
    loading.value = true;
    try {
        await $fetch('api/users/update', {
            method: 'POST',
            body: { user: user.value }
        })

        emit('success')
    } catch (error) {
        console.log(error)
        errorNotification('Unexpected Error Occured.')
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    setValues()
})
</script>
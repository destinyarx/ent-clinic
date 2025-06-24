<template>
    <Card class="py-6 px-8">
        <template #header>
            <div class="text-2xl">
                User's Profile

                <hr class="mt-2">
            </div>

            <div class="flex flex-row flex-wrap text-lg mt-4">
                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Name:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.name }}
                    </div>
                </div>

                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Birthdate:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.birthdate ? formatDate(authUser.profile.birthdate, 'MMMM d, yyyy') : 'None'}}
                    </div>
                </div>

                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Position:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.position ?? 'None'}}
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap text-lg mt-8">
                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Role:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.role }}
                    </div>
                </div>

                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        License Number:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.licenseNumber ?? 'None'}}
                    </div>
                </div>

                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Email:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.email ?? 'None'}}
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap text-lg mt-8">
                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Area of Designation:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.designationArea ?? 'None'}}
                    </div>
                </div>

                <div class="flex flex-col w-1/2">
                    <div class="font-semibold">
                        Permissions:
                    </div>
                    <div class="italic font-light">
                        <template v-if="authUser?.profile?.permissions">
                            <Badge 
                            v-for="permission in authUser.profile.permissions"
                            severity="info" 
                            class="text-xs py-2 px-1 mr-1"
                            >
                                {{ permission }}
                            </Badge>
                        </template>

                        <template  v-else>
                            <Badge severity="secondary" class="bg-gray-400">
                                None
                            </Badge>
                        </template>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center mt-4">
                <Button @click="showFormModal=true" label="Edit Profile" icon="pi pi-user-edit"/>
            </div>
        </template>
    </Card>

    <Dialog 
        v-model:visible="showFormModal" 
        header="Update Patient Profile"
        position="top" 
        :style="{ width: '75vw' }" 
        modal
    >

       <UserProfileForm @success="handleSuccess"/>
    </Dialog>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

import UserProfileForm from '@/components/forms/UserProfileForm.vue'
import { useUserStore } from '@/stores/authStore'
import { useDateFormatter } from '@/composables/useDateFormatter'

const authUser = useUserStore()
const { formatDate } = useDateFormatter()
const { success } = useNotification()

const showFormModal = ref<boolean>(false)

const handleSuccess = async () => {
    await authUser.setUserInfo()
    showFormModal.value = false
    success('Your info is updated successully')
}
</script>

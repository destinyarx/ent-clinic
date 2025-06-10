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
                        <!-- TODO: plot this with actual data -->
                        September 23, 1995
                    </div>
                </div>

                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Position:
                    </div>
                    <div class="italic font-light">
                        <!-- TODO: plot this with actual data -->
                        Resident Doctor 
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
                        MD12634848584
                    </div>
                </div>

                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Email:
                    </div>
                    <div class="italic font-light">
                        test_doctor@gmail.com
                    </div>
                </div>
            </div>

            <div class="flex flex-row flex-wrap text-lg mt-8">
                <div class="flex flex-col w-1/3">
                    <div class="font-semibold">
                        Area of Designation:
                    </div>
                    <div class="italic font-light">
                        <!-- TODO: plot this with actual data -->
                        EMD ENT Clinic Taytay, Rizal
                    </div>
                </div>

                <div class="flex flex-col w-1/2">
                    <div class="font-semibold">
                        Permissions:
                    </div>
                    <div class="italic font-light">
                        {{ authUser?.profile?.permissions }}
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-center mt-4">
                <Button label="Update Profile" icon="pi pi-user-edit"/>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

import { useUserStore } from '@/stores/authStore';

const authUser = useUserStore();
</script>

<template>
    <div class="flex min-h-[95vh] bg-slate-700">
        <div class="flex justify-center w-1/2">
            <div class="flex justify-center items-center">
                <img src="/img/login-cover-image.jpg" alt="Login Page Cover Picture" class="h-[85vh] rounded-lg block" />
            </div>
        </div>
        <div class="flex items-center justify-center w-1/2">
            <Card class="w-full mr-20">
                <template #content>
                    <div class="w-full">
                        <div class="flex flex-col justify-center">
                            <div class="text-center text-5xl my-10">
                                Sign-up 
                            </div>

                            <label for="name" class="font-medium text-xl ml-28 mb-2">Name</label>
                            <div class="w-full flex justify-center mb-8">
                                <InputText v-model="name" type="text" placeholder="Name" class="w-3/4" />
                            </div>

                            <label for="name" class="font-medium text-xl ml-28 mb-2">Email</label>
                            <div class="w-full flex justify-center mb-8">
                                <InputText v-model="email" type="text" placeholder="Email" class="w-3/4" />
                            </div>

                            <label for="username" class="font-medium text-xl ml-28 mb-2">Username</label>
                            <div class="w-full flex justify-center mb-8">
                                <InputText v-model="username" type="text" placeholder="Username" class="w-3/4" />
                            </div>

                            <label for="password" class="font-medium text-xl ml-28 mb-2">Password</label>
                            <div class="w-full flex justify-center mb-8">
                                <InputText v-model="password" type="text" placeholder="Password" class="w-3/4" />
                            </div>

                            <label for="password" class="font-medium text-xl ml-28 mb-2">Re-enter your Password</label>
                            <div class="w-full flex justify-center">
                                <InputText v-model="verifyPassword" type="text" placeholder="Password" class="w-3/4" />
                            </div> 

                            <div class="flex justify-center">
                                <Button @click="login" label="Signup" severity="success" class="mt-10 mb-2 w-24" rounded/>
                            </div>

                            <div v-if="loginError" class="text-sm text-red-400 ml-28">
                                Sign-up failed. Please check your infos and try again.
                            </div>
                        </div>
                    </div>

                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "guest-layout"
});

import { useRouter } from 'vue-router';
const router = useRouter();

const signup = async () => {
    
}

</script>
<template>
    <div class="flex min-h-[95vh] bg-slate-700 -mt-5">
        <div class="flex justify-center w-1/2">
            <div class="flex justify-center items-center">
                <img src="/img/login-cover-image.jpg" alt="Login Page Cover Picture" class="h-[80vh] w-[35vw] rounded-lg block" />
            </div>
        </div>
        <div class="flex items-center justify-center w-1/2">
            <Card class="w-full mr-20">
                <template #content>
                    <div class="w-full">
                        <div class="flex flex-col justify-center items-center">
                            <div class="text-center text-5xl font-semibold mb-3">
                                Sign-up 
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-3">
                                <label for="name" class="font-medium text-xl mb-2">Name</label>
                                <InputText v-model="name" type="text" placeholder="Name" />
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-3">
                                <label for="name" class="font-medium text-xl mb-2">Email</label>
                                <InputText v-model="email" type="text" placeholder="Email" />
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-3">
                                <label for="name" class="font-medium text-xl mb-2">Username</label>
                                <InputText v-model="username" type="text" placeholder="Username"/>
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-3">
                                <label for="name" class="font-medium text-xl mb-2">Password</label>
                                <Password v-model="password" type="text" placeholder="Password" fluid/>
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-3">
                                <label for="name" class="font-medium text-xl mb-2">Re-enter your Password</label>
                                <Password v-model="verifyPassword" name="password" placeholder="Password" :feedback="false" fluid />
                            </div>

                            <div class="flex justify-center">
                                <Button @click="signup" label="Request to Register" severity="success" class="mt-5 mb-2" rounded/>
                            </div>

                            <div v-if="loginError " class="text-sm text-red-400 text-center">
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

const signupError = ref('');

const signup = async () => {
    
}

</script>
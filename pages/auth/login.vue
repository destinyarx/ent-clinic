<template>
    <div class="flex min-h-[95vh] bg-slate-700">
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
                            <div class="text-center font-semibold text-5xl my-14">
                                Login 
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-10">
                                <label for="username" class="font-medium text-xl mb-2">Username</label>
                                <InputText v-model="username" type="text" placeholder="Username" />
                            </div>

                            <div class="w-3/4 flex flex-col flex-wrap mb-5">
                                <label for="username" class="font-medium text-xl mb-2">Password</label>
                                <InputText v-model="password" @keydown.enter="login()" type="text" placeholder="Password"/>
                                <div v-if="loginError" class="text-sm text-red-400">
                                    Login failed. Please check your credentials and try again.
                                </div>
                            </div>

                            <div class="flex justify-center">
                                <Button @click="login" label="Login" severity="success" class="mt-10 mb-5 w-24" rounded/>
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
import { useUserStore } from '@/stores/authStore';

const router = useRouter();
const supabase = useSupabaseClient();

const { errorNotification } = useNotification();
const userStore = useUserStore();

const username = ref('')
const password = ref('')
const loading = ref(false)
const token = ref()
const loginError = ref(false);

const user = useSupabaseUser()
const session = await supabase.auth.getSession();
token.value = session.data.session?.access_token;

const login = async () => {
    loading.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: username.value,
        password: password.value,
    })

    if (error) {
        errorNotification('Login Failed.');
        loginError.value = true;

        return;
    } 

    // proceed to login
    userStore.setUserInfo();
    router.push('/patients');
}

</script>
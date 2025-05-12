<template>
    <div class="min-h-screen dark:bg-slate-700 dark:text-zinc-50">
        <div class="flex flex-row justify-between w-full mr-10">
            <div class="flex flex-row justify-start items-center gap-5 mt-2">
                <NuxtLink to="/">
                    <img src="/img/entcare.png" alt="avatar" class="rounded-full object-cover w-24 h-24 bg-sky-200 ml-10"/>
                </NuxtLink>
    
                <NuxtLink to="/">
                    <div class="text-3xl text-cyan-200 mt-3">
                        ENT Clinic
                    </div>
                </NuxtLink>
            </div>


            <ul class="flex flex-row justify-center gap-8 align-top text-md">
                <li v-for="header in headers" class="my-3">
                    <NuxtLink :to="header.path">
                        <span class="text-2xl" :class="currentPath === header.path ? 'text-cyan-400' : ''">
                            {{ header.title }} 
                        </span>
                    </NuxtLink>
                </li>
            </ul>
        </div>

        <div class="min-w-full dark:text-zinc-50 mx-5">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPath = computed(() => route.path);
const supabase = useSupabaseClient();


const headers = [
    { title: 'Login', path: '/auth/login' },
    { title: 'Sign-up', path: '/auth/signup' },
    { title: 'Contact us', path: '/contact-us' }
]
</script>
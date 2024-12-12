<template>
    <div class="min-h-screen dark:bg-slate-700 dark:text-zinc-50">
        <div class="flex flex-row justify-between mr-10">
            <NuxtLink to="/">
                <div class="text-5xl text-cyan-200 ml-14 mt-3">
                    ENT Clinic
                </div>
            </NuxtLink>

            <ul class="flex flex-row justify-center gap-8  align-top text-md">
                <li v-for="header in headers" class="my-3">
                    <NuxtLink :to="header['path']">
                        <span class="text-2xl" :class="currentPath === header['path'] ? 'text-cyan-400' : ''">
                            {{ header['title'] }}
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
    { title: 'Login', path: '/login' },
    { title: 'Sign-up', path: '/signup' },
    { title: 'Contact us', path: '/contactUs' }
]
</script>
<template>
    <div class="min-h-screen bg-slate-700 dark:text-zinc-50">
        <div class="flex flex-row justify-between mr-10">
            <div class="text-3xl text-cyan-200 ml-14 ">Nuxt Playground</div>
            <ul class="flex flex-row justify-center gap-7 align-top text-md">
                <li v-for="header in headers" class="my-3">
                    <NuxtLink :to="header['url']">
                        {{ header['title'] }}
                    </NuxtLink>
                </li>
            </ul>
        </div>
        <div class="min-w-full dark:text-zinc-50">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const headers = [
    { title: 'Products', url: '/products' },
    { title: 'Users', url: '/users' },
    { title: 'Patients', url: '/patients' },
    { title: 'Accounts', url: '/accounts' },
    { title: 'Summary', url: '/summary' },
]
</script>
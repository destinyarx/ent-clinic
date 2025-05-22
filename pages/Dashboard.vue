<template>
    <div class="text-5xl">
        Dashboard
    </div>

    <div class="text-center text-sm">
        {{ userStore.profile }}
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
});

import { useUserStore } from '@/stores/authStore';

const userStore = useUserStore();
</script>
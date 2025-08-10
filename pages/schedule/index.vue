<template>
    <div class="text-center text-3xl">
        Schedule Page
    </div>

    <ScheduleDT class="mt-10"/>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
})

import ScheduleDT from '@/components/datatables/ScheduleDT.vue';
</script>
<template>
    <div class="text-center text-3xl">
        Schedule Page
    </div>

    <scheduleDT class="mt-10"/>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
})

import scheduleDT from '~/components/Datatables/ScheduleDT.vue';
</script>
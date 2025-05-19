<template>
    <div class="text-center text-3xl">
        Queue Page
    </div>
    
    <QueueDT class="mt-10"/>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
})

import QueueDT from '~/components/Datatables/QueueDT.vue';
</script>

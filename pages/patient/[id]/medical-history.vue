<template>
    <PatientNavbar>
        <div> Medical History </div>
    </PatientNavbar>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'authenticated-layout' })

import PatientNavbar from '@/components/PatientNavbar.vue'

const { id } = useRoute().params;
</script>
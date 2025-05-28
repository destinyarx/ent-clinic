<template>
    <div>
        Patient Page
    </div>

    <div class="flex flex-row">
        
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'authenticated-layout',
});

const patientList = ref<Object[]>();
const loading = ref<boolean>();
const searchValue = ref<string>();

const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10;

const selectedFilter = ref('');
const filterList = [
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' },
    { name: 'In Progress', value: 'in_progress' },
];
</script>
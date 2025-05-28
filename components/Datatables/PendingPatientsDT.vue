<template>
    <div>
        Pending Patients
    </div>
</template>

<script setup lang="ts">
const patients = ref([]);
const loading = ref<boolean>();
const searchValue = ref<string>();
const hasNextPage = ref<boolean>(false);
const currentPage = ref<number>(0);
const itemsPerPage = 10;

const fetchData = async () => {
    console.log('Mounted');
}

onMounted(() => {
    fetchData();
});
</script>
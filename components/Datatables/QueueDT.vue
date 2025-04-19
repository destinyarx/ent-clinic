<template>
    <div class="text-center">
        <Datatable :value="patients" stripedRows size="small" tableStyle="min-width: 70rem; border-radius: 10px;">

        </Datatable>
    </div>
</template>

<script setup lang="ts">
const patients = ref();


</script>

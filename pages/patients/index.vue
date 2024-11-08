<template>
    <div class="flex justify-center">
        Patients Page
    </div>
    <div class="flex justify-center">
        <Button label="Check" />
        <DatePicker v-model="date" class="ml-4"/>
    </div>
    <div class="flex justify-center">
        
    </div>
</template>

<script setup lang="ts">
const date = ref()
</script>

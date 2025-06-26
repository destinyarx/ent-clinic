<template>
    <div>
        Medical History
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    patient: {
        id: number,
        encounterId: number|null|undefined
    }
}>();
</script>
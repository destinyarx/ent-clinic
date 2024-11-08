<template>
    <Card>
        <template #title>
            {{ title }}
        </template>
        <template #content>
            {{ content }}
        </template>
    </Card>
</template>

<script setup lang="ts">
const props = defineProps({
    title: { type: String },
    content: { type: String },
})

</script>
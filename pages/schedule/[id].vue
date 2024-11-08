<template>
    <div class="text-center text-2xl mt-20">
        Hello, welcome user id #{{ id }}
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app'

definePageMeta({
    middleware: 'test'
})

const id = useRoute().params.id
</script>

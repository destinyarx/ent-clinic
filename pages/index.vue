<template>
    <div>
        <CardComponent title='My Card Title' content='Card Content Here...'/>
    </div>

    {{ user }}
</template>

<script setup lang="ts">
const user = useSupabaseUser()

</script>

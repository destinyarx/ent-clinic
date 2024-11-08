<template>
    <div>
        <CardComponent title='My Card Title' content='Card Content Here...'/>
    </div>

    <!-- {{ pokemon }} -->
    <!-- {{ expenses }} -->
</template>

<script setup lang="ts">

// const { data: pokemon } = await useFetch('https://pokeapi.co/api/v2/pokemon/pikachu')

const expenseId = 2; // This dynamically grabs the `id` from the route

// Fetch the data from the API with the dynamic ID
const { data: expenses, error } = await useFetch(`/api/expenses/${expenseId}`);

if (error.value) {
  console.error("Error fetching expense:", error.value);
}

onMounted(() => {
    console.log('Component Loaded')
})

</script>

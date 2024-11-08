<template>
    <div class="flex justify-center">   
        Product Details:

        <!-- <div>{{ product.title }} - {{ product.price }}</div> -->
    </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const uri = 'https://fakestoreapi.com/products/' + id

const { data: product } = await useFetch(uri)

onMounted(async () => {
    console.log('Components Mounted')
})

</script>
<template> 
    <div class="w-[100vw] grid grid-cols-12 gap-4 grid-nogutter bg-surface-0 dark:bg-surface-950 text-surface-800 dark:text-surface-50">
        <div class="flex flex-col items-center justify-center col-span-12 md:col-span-6 pt-12 pb-5 text-center">
            <div class="h-[80%] flex items-center">
                <section class="text-left mt-30">
                    <div class="block text-7xl font-bold mb-1">
                        ENTCare:
                    </div>
                    <div class="block text-6xl font-bold mb-1">
                        <span class="text-blue-600"> Record.</span>
                        <span class="text-yellow-500"> Connect.</span>
                        <span class="text-green-600"> Care.</span>
                    </div>
                    <p class="mb-6 text-[0.91rem] text-surface-800 dark:text-surface-100 leading-normal mt-2">
                        Manage patient records with ease, connect your clinic seamlessly, and deliver care that truly matters.
                    </p>
    
                    <!-- <Button label="Learn More" type="button" class="mr-4" raised></Button>
                    <Button label="Contact" type="button" outlined></Button> -->
                </section>
            </div>

            <div class="h-[20%] flex items-end justify-end -mt-10">
                <div class="text-sm italic">Created by: Gil Jeremy P. Ditablan @2025</div>
            </div>
        </div>
        <div class="flex justify-end col-span-12 md:col-span-6 overflow-hidden">
            <img src="/img/landing-page-image.jpg" alt="Image" class="m-auto h-[90vh] w-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)">
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "guest-layout"
})

</script>
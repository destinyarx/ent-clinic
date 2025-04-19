<template>
    <div class="flex min-h-[95vh] bg-slate-700">
        <div class="flex justify-center w-1/2">
            <div class="flex justify-center items-center">
                <img src="/img/login-cover-image.jpg" alt="Login Page Cover Picture" class="h-[80vh] w-[35vw] rounded-lg block" />
            </div>
        </div>
        <div class="flex items-center justify-center w-1/2">
            <Card class="w-full mr-20">
                <template #content>
                    <div class="w-full">
                        <div class="flex flex-col justify-center">
                            <div class="text-center text-4xl my-14">
                                Contact Us! 
                            </div>
                        </div>
                    </div>

                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: "guest-layout"
})

</script>

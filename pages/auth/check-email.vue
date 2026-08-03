<template>
  <div class="flex min-h-[80vh] items-center justify-center bg-slate-700 px-5">
    <Card class="w-full max-w-lg text-center">
      <template #content>
        <i class="pi pi-envelope mb-5 text-5xl text-sky-600" aria-hidden="true" />
        <h1 class="text-3xl font-semibold">Check your email</h1>
        <p class="mt-4 text-slate-600">
          We sent a confirmation link<span v-if="email"> to <strong>{{ email }}</strong></span>.
          Confirm your address, then continue to clinic setup.
        </p>
        <NuxtLink to="/auth/login">
          <Button label="Return to login" class="mt-7" outlined />
        </NuxtLink>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'guest-layout' })
const route = useRoute()
const email = computed(() => typeof route.query.email === 'string' ? route.query.email : '')
</script>

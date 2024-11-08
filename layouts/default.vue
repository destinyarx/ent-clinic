<template>
    <div class="min-h-screen dark:bg-slate-700 dark:text-zinc-50">
        <div class="flex flex-row justify-between mr-10">
            <div class="text-3xl text-cyan-200 ml-14 ">Nuxt Playground</div>

            <ul class="flex flex-row justify-center gap-7 align-top text-md">
                <li v-for="header in headers" class="my-3">
                    <NuxtLink :to="header['url']">
                        {{ header['title'] }}
                    </NuxtLink>
                </li>
            </ul>

            <Button @click="signOut" label="Logout"/>
        </div>
        <div class="min-w-full dark:text-zinc-50 mx-5">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

const headers = [
    { title: 'Patients', url: '/patients' },
    { title: 'Users', url: '/users' },
    { title: 'Schedule', url: '/schedule' },
    { title: 'Summary', url: '/summary' },
    { title: 'Accounts', url: '/accounts' },
]

async function signOut() {
  const { error } = await supabase.auth.signOut()
  console.log(error)
}

</script>
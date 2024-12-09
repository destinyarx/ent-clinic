<template>
    <div class="min-h-screen w-screen dark:bg-slate-700 dark:text-zinc-50">
        <div class="flex flex-row justify-between mr-10">
            <div class="text-5xl text-cyan-200 ml-14  mt-3">
                ENT Clinic {{  patientBadgeCount }}
            </div>

            <ul class="flex flex-row justify-center gap-7 align-top text-2xl">
                <li v-for="header in headers" class="my-3">
                    <NuxtLink :to="header['path']">
                        <span :class="currentPath === header['path'] ? 'text-cyan-400' : ''">
                            {{ header['title'] }}
                        </span>
                    </NuxtLink>
                </li>

                <Button v-if="user" @click="signOut" label="Logout" class="ml-7"/>
            </ul>
        </div>
        
        <div class="min-w-full dark:text-zinc-50 mx-5">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useBadgeStore } from '@/stores/notificationStore';

const badgeStore = useBadgeStore();
const router = useRouter();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const route = useRoute();
const currentPath = computed(() => route.path)

const session = await supabase.auth.getSession();
const token = ref();
token.value = session.data.session?.access_token;

const patientBadgeCount = computed(() => badgeStore.getBadgeCount('patients'));

const headers = [
    { title: 'Patients', path: '/patients' },
    { title: 'Schedule', path: '/schedule' },
    { title: 'Accounts', path: '/accounts' },
]

async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (!error) {
    router.push('/');
  }
}

</script>
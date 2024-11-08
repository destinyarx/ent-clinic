<template>
    <div class="flex flex-col justify-center gap-3 items-center mt-20 text-2xl">
        <InputText v-model="email" variant="outlined" placeholder="Username" />
        <InputText v-model="password" variant="outlined" placeholder="Password"/>
        <Button @click="submit" type="submit" severity="secondary" label="Login" />

        <div v-if="loading" class="text-cyan-400 text-lg mt-5">
            loading....
        </div>

        <!-- {{ user }} -->

        {{ token }}

        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const token = ref()

const user = useSupabaseUser()
console.log(user)

const session = await supabase.auth.getSession();
token.value = session.data.session?.access_token;

const submit = async () => {
    loading.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
        options: {
            emailRedirectTo: 'https://example.com/welcome',
        },
    })

    console.log(error)
    loading.value = false;
}
</script>

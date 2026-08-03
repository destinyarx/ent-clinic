<template>
  <div class="flex min-h-[85vh] bg-slate-700">
    <div class="hidden w-1/2 justify-center lg:flex">
      <div class="flex items-center justify-center">
        <img src="/img/login-cover-image.jpg" alt="ENT clinic reception" class="block h-[80vh] w-[35vw] rounded-lg object-cover" />
      </div>
    </div>

    <div class="flex w-full items-center justify-center px-5 lg:w-1/2">
      <Card class="w-full max-w-xl lg:mr-20">
        <template #content>
          <div class="flex flex-col items-center">
            <h1 class="my-10 text-center text-5xl font-semibold">Login</h1>

            <div class="flex w-3/4 flex-col gap-3">
              <Button label="Continue with Google" icon="pi pi-google" severity="secondary" outlined :loading="oauthProvider === 'google'" @click="oauthLogin('google')" />
              <Button label="Continue with Facebook" icon="pi pi-facebook" severity="info" outlined :loading="oauthProvider === 'facebook'" @click="oauthLogin('facebook')" />
            </div>

            <div class="my-7 flex w-3/4 items-center gap-3 text-sm text-slate-500">
              <span class="h-px flex-1 bg-slate-300" />
              <span>or use email</span>
              <span class="h-px flex-1 bg-slate-300" />
            </div>

            <div class="mb-5 flex w-3/4 flex-col">
              <label for="email" class="mb-2 text-xl font-medium">Email</label>
              <InputText id="email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" />
            </div>

            <div class="mb-5 flex w-3/4 flex-col">
              <label for="password" class="mb-2 text-xl font-medium">Password</label>
              <Password id="password" v-model="password" autocomplete="current-password" :feedback="false" placeholder="Password" fluid @keydown.enter="login" />
              <p v-if="loginError" class="mt-2 text-sm text-red-500" role="alert">{{ loginError }}</p>
            </div>

            <Button label="Login" severity="success" class="mb-5 mt-6 w-28" rounded :loading="loading" @click="login" />
            <NuxtLink to="/auth/signup" class="mb-8 text-sm text-sky-700 hover:underline">Create an account</NuxtLink>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Provider } from '@supabase/supabase-js'
import { fetchOnboardingStatus } from '@/features/onboarding/services/onboardingService'
import { getApiErrorMessage } from '@/utils/apiError'

definePageMeta({ layout: 'guest-layout' })

const supabase = useSupabaseClient()
const router = useRouter()
const userStore = useUserStore()
const { errorNotification } = useNotification()

const email = ref('')
const password = ref('')
const loading = ref(false)
const oauthProvider = ref<Provider | null>(null)
const loginError = ref('')

async function routeAuthenticatedUser() {
  const { data } = await fetchOnboardingStatus()

  if (data.state === 'member') {
    await userStore.setUserInfo()
    return router.push('/new-dashboard')
  }

  return router.push(data.state === 'pending' ? '/auth/pending' : '/auth/onboarding')
}

async function login() {
  if (!email.value || !password.value || loading.value) return

  loading.value = true
  loginError.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({ email: email.value.trim(), password: password.value })
    if (error) throw error
    await routeAuthenticatedUser()
  } catch (error) {
    loginError.value = getApiErrorMessage(error, 'Login failed. Check your credentials and try again.')
    errorNotification(loginError.value, 'Login failed')
  } finally {
    loading.value = false
  }
}

async function oauthLogin(provider: 'google' | 'facebook') {
  if (oauthProvider.value) return

  oauthProvider.value = provider
  loginError.value = ''

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })

  if (error) {
    loginError.value = error.message
    errorNotification(error.message, 'OAuth login failed')
    oauthProvider.value = null
  }
}
</script>

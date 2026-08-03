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
            <h1 class="mb-7 mt-5 text-center text-4xl font-semibold">Create account</h1>

            <div class="flex w-3/4 flex-col gap-3">
              <Button label="Sign up with Google" icon="pi pi-google" severity="secondary" outlined :loading="oauthProvider === 'google'" @click="oauthSignup('google')" />
              <Button label="Sign up with Facebook" icon="pi pi-facebook" severity="info" outlined :loading="oauthProvider === 'facebook'" @click="oauthSignup('facebook')" />
            </div>

            <div class="my-5 flex w-3/4 items-center gap-3 text-sm text-slate-500">
              <span class="h-px flex-1 bg-slate-300" />
              <span>or use email</span>
              <span class="h-px flex-1 bg-slate-300" />
            </div>

            <div class="grid w-3/4 grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex flex-col">
                <label for="first-name" class="mb-1 font-medium">First name</label>
                <InputText id="first-name" v-model="firstName" autocomplete="given-name" />
              </div>
              <div class="flex flex-col">
                <label for="last-name" class="mb-1 font-medium">Last name</label>
                <InputText id="last-name" v-model="lastName" autocomplete="family-name" />
              </div>
            </div>

            <div class="mt-4 flex w-3/4 flex-col">
              <label for="signup-email" class="mb-1 font-medium">Email</label>
              <InputText id="signup-email" v-model="email" type="email" autocomplete="email" />
            </div>

            <div class="mt-4 flex w-3/4 flex-col">
              <label for="signup-password" class="mb-1 font-medium">Password</label>
              <Password id="signup-password" v-model="password" autocomplete="new-password" placeholder="At least 6 characters" fluid />
            </div>

            <div class="mt-4 flex w-3/4 flex-col">
              <label for="verify-password" class="mb-1 font-medium">Re-enter password</label>
              <Password id="verify-password" v-model="verifyPassword" autocomplete="new-password" :feedback="false" fluid @keydown.enter="signup" />
              <p v-if="signupError" class="mt-2 text-sm text-red-500" role="alert">{{ signupError }}</p>
            </div>

            <Button label="Create account" severity="success" class="mb-3 mt-5" rounded :loading="loading" @click="signup" />
            <NuxtLink to="/auth/login" class="mb-5 text-sm text-sky-700 hover:underline">Already have an account?</NuxtLink>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Provider } from '@supabase/supabase-js'
import { getApiErrorMessage } from '@/utils/apiError'

definePageMeta({ layout: 'guest-layout' })

const supabase = useSupabaseClient()
const router = useRouter()
const { errorNotification } = useNotification()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const verifyPassword = ref('')
const loading = ref(false)
const oauthProvider = ref<Provider | null>(null)
const signupError = ref('')

async function signup() {
  signupError.value = ''

  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value) {
    signupError.value = 'Complete all required fields.'
    return
  }

  if (password.value !== verifyPassword.value) {
    signupError.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value.trim(),
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName.value.trim(),
          last_name: lastName.value.trim(),
          full_name: `${firstName.value.trim()} ${lastName.value.trim()}`,
        },
      },
    })

    if (error) throw error

    await router.push(data.session ? '/auth/onboarding' : `/auth/check-email?email=${encodeURIComponent(email.value.trim())}`)
  } catch (error) {
    signupError.value = getApiErrorMessage(error, 'Unable to create your account.')
    errorNotification(signupError.value, 'Signup failed')
  } finally {
    loading.value = false
  }
}

async function oauthSignup(provider: 'google' | 'facebook') {
  if (oauthProvider.value) return

  oauthProvider.value = provider
  signupError.value = ''

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })

  if (error) {
    signupError.value = error.message
    errorNotification(error.message, 'OAuth signup failed')
    oauthProvider.value = null
  }
}
</script>

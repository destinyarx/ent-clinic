import { fetchOnboardingStatus } from '@/features/onboarding/services/onboardingService'
import { useUserStore } from '@/stores/authStore'

const visitorRoutes = new Set([
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/callback',
  '/auth/check-email',
  '/landingPage',
  '/contact-us',
])

const onboardingRoutes = new Set([
  '/auth/onboarding',
  '/auth/pending',
  '/auth/callback',
  '/auth/check-email',
])

export default defineNuxtRouteMiddleware(async (to) => {
  const authUser = useSupabaseUser()
  const userStore = useUserStore()

  if (!authUser.value) {
    userStore.signOut()

    if (!visitorRoutes.has(to.path)) {
      return navigateTo('/auth/login')
    }

    return
  }

  const { data: status } = await fetchOnboardingStatus()

  if (status.state === 'pending') {
    if (to.path !== '/auth/pending') {
      return navigateTo('/auth/pending')
    }
    return
  }

  if (status.state === 'onboarding') {
    if (to.path !== '/auth/onboarding') {
      return navigateTo('/auth/onboarding')
    }
    return
  }

  if (userStore.profile?.id !== authUser.value.id) {
    await userStore.setUserInfo()
  }

  if (visitorRoutes.has(to.path) || onboardingRoutes.has(to.path)) {
    return navigateTo('/new-dashboard')
  }
})

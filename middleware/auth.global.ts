import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()

    // If there is no authenticated user and we are not on the login, signup, or root page
    if (!user.value && !['/', '/login', '/signup'].includes(to.path)) {
        return navigateTo('/login')
    }
})

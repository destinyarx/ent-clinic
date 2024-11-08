import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    
    // If there is no authenticated user, redirect to login
    if (!user.value) {
        return navigateTo('/login')
    }
})

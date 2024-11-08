export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()

    if (!user.value) {
        return navigateTo('/login')
    }
  

    if (user.value && to.path !== '/' && to.path !== from.path) {
        return navigateTo(to.path)
    }
})
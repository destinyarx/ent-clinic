export default defineNuxtRouteMiddleware((to, from) => {
    if (to.params.id === '1') {
        return navigateTo('/error')
    }
  

    if (to.path !== '/' && to.path !== from.path) {
        return navigateTo(to.path)
    }
})
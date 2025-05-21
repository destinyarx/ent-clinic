import { defineNuxtRouteMiddleware, navigateTo } from '#app'

const publicLinks = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/landingPage",
    "/contact-us"
];

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();

    // If there is no authenticated user and we are not on the login, signup, or root page
    if (!user.value && !publicLinks.includes(to.path)) {
        return navigateTo('/auth/login')
    }
})

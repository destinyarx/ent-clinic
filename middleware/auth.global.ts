import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUserStore } from '@/stores/authStore';


const publicLinks = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/landingPage",
    "/contact-us"
];

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUserStore()
    const authUser = useSupabaseUser();

    if (authUser && !user.profile?.id) {
        await user.setUserInfo();
    }

    // If there is no authenticated user and we are not on the login, signup, or root page
    if (!authUser.value && !publicLinks.includes(to.path)) {
        return navigateTo('/auth/login')
    }

    else if (authUser.value && publicLinks.includes(to.path)) {
        return navigateTo('/new-dashboard')
    }
})

<template>
    <div class="flex h-screen bg-gray-300 px-2 dark:bg-slate-800">
        <!-- Sidebar -->
        <div :class="isCollapsed ? 'w-24' : 'w-80'"
            class="flex flex-col h-[99vh] transition-all duration-300 border-2 rounded-xl pr-5 pl-2 mt-1 mb-1 bg-zinc-100 dark:bg-gray-800 dark:text-white">

            <div class="flex items-center justify-end p-4">
                <button @click="toggleSidebar" class="px-2 py-1 ml-1 text-sm dark:bg-gray-600 rounded hover:bg-gray-500">
                    {{ isCollapsed ? '>>' : '<<' }}
                </button>
            </div>

            <div class="overflow-hidden p-2 mt-5">
                <div class="mb-10">
                    <div class="flex justify-center">
                        <img src="/img/male-person.png" alt="avatar" class="rounded-full object-cover bg-sky-200" :class="isCollapsed ? 'w-15 h-15' : 'w-20 h-20'" />
                    </div>
    
                    <template v-if="!isCollapsed">
                        <div class="text-center font-semibold mt-3">
                            {{ authUser.profile.name }}
                        </div>
                        <div class="text-center text-gray-800 font-medium italic dark:text-zinc-50">
                            {{ authUser.profile.role }}
                        </div>
                    </template>
                </div>

                <NuxtLink to="/dashboard">
                    <div @click="setCurrentTab('dashboard')" class="flex items-center space-x-4 rounded-full  mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'dashboard' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">

                        <template v-if="currentTab === 'dashboard'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                                <path fill="#fff" d="M10.995 4.68v3.88A2.44 2.44 0 0 1 8.545 11h-3.86a2.38 2.38 0 0 1-1.72-.72a2.4 2.4 0 0 1-.71-1.72V4.69a2.44 2.44 0 0 1 2.43-2.44h3.87a2.42 2.42 0 0 1 1.72.72a2.4 2.4 0 0 1 .72 1.71m10.75.01v3.87a2.46 2.46 0 0 1-2.43 2.44h-3.88a2.5 2.5 0 0 1-1.73-.71a2.44 2.44 0 0 1-.71-1.73V4.69a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.87a2.46 2.46 0 0 1 2.44 2.44m0 10.75v3.87a2.46 2.46 0 0 1-2.43 2.44h-3.88a2.5 2.5 0 0 1-1.75-.69a2.42 2.42 0 0 1-.71-1.73v-3.87a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.87a2.46 2.46 0 0 1 2.44 2.44zm-10.75.01v3.87a2.46 2.46 0 0 1-2.45 2.43h-3.86a2.42 2.42 0 0 1-2.43-2.43v-3.87A2.46 2.46 0 0 1 4.685 13h3.87a2.5 2.5 0 0 1 1.73.72a2.45 2.45 0 0 1 .71 1.73" />
                            </svg>
                        </template>
                        <template v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                                <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.557 2.75H4.682A1.93 1.93 0 0 0 2.75 4.682v3.875a1.94 1.94 0 0 0 1.932 1.942h3.875a1.94 1.94 0 0 0 1.942-1.942V4.682A1.94 1.94 0 0 0 8.557 2.75m10.761 0h-3.875a1.94 1.94 0 0 0-1.942 1.932v3.875a1.943 1.943 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942V4.682a1.93 1.93 0 0 0-1.932-1.932m0 10.75h-3.875a1.94 1.94 0 0 0-1.942 1.933v3.875a1.94 1.94 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942v-3.875a1.93 1.93 0 0 0-1.932-1.932M8.557 13.5H4.682a1.943 1.943 0 0 0-1.932 1.943v3.875a1.93 1.93 0 0 0 1.932 1.932h3.875a1.94 1.94 0 0 0 1.942-1.932v-3.875a1.94 1.94 0 0 0-1.942-1.942" />
                            </svg>
                        </template>
    
                        <div class="font-medium">Dashboard</div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/all-patients">
                    <div @click="setCurrentTab('allPatients')" class="flex items-center space-x-4 rounded-full mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'allPatients' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">

                        <template v-if="currentTab === 'patients'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-12 h-12 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                                <path fill="#fff" d="M6.75 10a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5m5.687 5.145c.53.217 1.204.355 2.062.355c4 0 4-3 4-3A1.5 1.5 0 0 0 17 11h-4.628c.393.476.629 1.085.629 1.75v.356a3 3 0 0 1-.017.252a5 5 0 0 1-.546 1.787M17 7.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0M1.5 13a2 2 0 0 1 2-2H10a2 2 0 0 1 2 2s0 4-5.25 4s-5.25-4-5.25-4m11.5.106l-.003.064Z" />
                            </svg>
                        </template>
                        <template v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-12 h-12 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                                <path fill="#000" d="M4.5 6.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M6.75 3.5a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5m5.687 11.645c.538.22 1.215.355 2.063.355c1.881 0 2.921-.668 3.469-1.434a2.9 2.9 0 0 0 .521-1.36a2 2 0 0 0 .01-.137V12.5A1.5 1.5 0 0 0 17 11h-4.63c.24.29.42.629.525 1H17a.5.5 0 0 1 .5.5v.054l-.005.05a1.9 1.9 0 0 1-.34.88c-.327.459-1.037 1.016-2.655 1.016c-.732 0-1.278-.114-1.687-.281c-.082.28-.201.596-.376.926M1.5 13a2 2 0 0 1 2-2H10a2 2 0 0 1 2 2v.084l-.002.04l-.01.135a3.95 3.95 0 0 1-.67 1.806C10.617 16.08 9.263 17 6.75 17s-3.867-.92-4.568-1.934a3.95 3.95 0 0 1-.67-1.807a3 3 0 0 1-.012-.175zm1 .06v.018l.007.083a2.95 2.95 0 0 0 .498 1.336C3.492 15.201 4.513 16 6.75 16s3.258-.799 3.745-1.503a2.95 2.95 0 0 0 .498-1.336q.006-.057.006-.083l.001-.017V13a1 1 0 0 0-1-1H3.5a1 1 0 0 0-1 1zM13 7.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M14.5 5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5" />
                            </svg>
                        </template>
    
                        <div class="text-black font-medium">All Patients</div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/patients">
                    <div @click="setCurrentTab('patients')" class="flex items-center space-x-4 rounded-full mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'patients' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">

                        <template v-if="currentTab === 'patients'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-12 h-12 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                                <path fill="#fff" d="M6.75 10a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5m5.687 5.145c.53.217 1.204.355 2.062.355c4 0 4-3 4-3A1.5 1.5 0 0 0 17 11h-4.628c.393.476.629 1.085.629 1.75v.356a3 3 0 0 1-.017.252a5 5 0 0 1-.546 1.787M17 7.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0M1.5 13a2 2 0 0 1 2-2H10a2 2 0 0 1 2 2s0 4-5.25 4s-5.25-4-5.25-4m11.5.106l-.003.064Z" />
                            </svg>
                        </template>
                        <template v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-12 h-12 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                                <path fill="#000" d="M4.5 6.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M6.75 3.5a3.25 3.25 0 1 0 0 6.5a3.25 3.25 0 0 0 0-6.5m5.687 11.645c.538.22 1.215.355 2.063.355c1.881 0 2.921-.668 3.469-1.434a2.9 2.9 0 0 0 .521-1.36a2 2 0 0 0 .01-.137V12.5A1.5 1.5 0 0 0 17 11h-4.63c.24.29.42.629.525 1H17a.5.5 0 0 1 .5.5v.054l-.005.05a1.9 1.9 0 0 1-.34.88c-.327.459-1.037 1.016-2.655 1.016c-.732 0-1.278-.114-1.687-.281c-.082.28-.201.596-.376.926M1.5 13a2 2 0 0 1 2-2H10a2 2 0 0 1 2 2v.084l-.002.04l-.01.135a3.95 3.95 0 0 1-.67 1.806C10.617 16.08 9.263 17 6.75 17s-3.867-.92-4.568-1.934a3.95 3.95 0 0 1-.67-1.807a3 3 0 0 1-.012-.175zm1 .06v.018l.007.083a2.95 2.95 0 0 0 .498 1.336C3.492 15.201 4.513 16 6.75 16s3.258-.799 3.745-1.503a2.95 2.95 0 0 0 .498-1.336q.006-.057.006-.083l.001-.017V13a1 1 0 0 0-1-1H3.5a1 1 0 0 0-1 1zM13 7.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M14.5 5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5" />
                            </svg>
                        </template>
    
                        <div class="text-black font-medium">Patients</div>
                    </div>
                </NuxtLink>
                
                <NuxtLink to="queue">
                    <div @click="setCurrentTab('queue')" class="flex items-center space-x-4 rounded-full  mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'queue' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-12 h-10 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                            <path :fill="currentTab === 'queue' ? '#fff' : '#000'" d="M13.902 10.946a4.25 4.25 0 1 0 0-7.392a5.7 5.7 0 0 1 1.001 1.732a2.25 2.25 0 1 1 0 3.928a5.7 5.7 0 0 1-1 1.732m.522 17.861a6.5 6.5 0 0 0 8.078-6.307v-7a2.5 2.5 0 0 0-2.5-2.5h-3.377a4 4 0 0 1 .846 2H20a.5.5 0 0 1 .5.5v7a4.5 4.5 0 0 1-4.383 4.499a8 8 0 0 1-1.694 1.808m5.978-17.86a4.25 4.25 0 1 0 0-7.392c.428.508.77 1.093 1.001 1.73a2.25 2.25 0 1 1 0 3.928a5.7 5.7 0 0 1-1 1.733m.522 17.86a6.5 6.5 0 0 0 8.078-6.307v-7a2.5 2.5 0 0 0-2.5-2.5h-3.377a4 4 0 0 1 .846 2h2.53a.5.5 0 0 1 .5.5v7a4.5 4.5 0 0 1-4.383 4.499a8 8 0 0 1-1.694 1.808M3 15.5A2.5 2.5 0 0 1 5.5 13h8a2.5 2.5 0 0 1 2.5 2.5v7a6.5 6.5 0 1 1-13 0zm2.5-.5a.5.5 0 0 0-.5.5v7a4.5 4.5 0 1 0 9 0v-7a.5.5 0 0 0-.5-.5zm1.75-7.75a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0M9.5 3a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5" />
                        </svg>
    
                        <div class="text-black font-medium">Queue</div>
                    </div>
                </NuxtLink>
                
                <NuxtLink to="schedule">
                    <div @click="setCurrentTab('schedule')" class="flex items-center space-x-4 rounded-full mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'schedule' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-12 h-12 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                            <path :fill="currentTab === 'schedule' ? '#fff' : '#000'" d="M5.616 21q-.691 0-1.153-.462T4 19.385V6.615q0-.69.463-1.152T5.616 5h1.769V3.308q0-.233.153-.386t.385-.153t.386.153t.153.386V5h7.154V3.27q0-.214.143-.358t.357-.143t.356.143t.144.357V5h1.769q.69 0 1.153.463T20 6.616v12.769q0 .69-.462 1.153T18.384 21zm0-1h12.769q.23 0 .423-.192t.192-.424v-8.768H5v8.769q0 .23.192.423t.423.192M5 9.615h14v-3q0-.23-.192-.423T18.384 6H5.616q-.231 0-.424.192T5 6.616zm0 0V6zm7 4.539q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.539t-.54.23m-4 0q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.539t-.54.23m8 0q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.539t-.54.23M12 18q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.54T12 18m-4 0q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.54T8 18m8 0q-.31 0-.54-.23t-.23-.54t.23-.539t.54-.23t.54.23t.23.54t-.23.54T16 18" />
                        </svg>
    
                        <div class="text-black font-medium">Schedule</div>
                    </div>
                </NuxtLink>
                
                <NuxtLink to="profile">
                    <div @click="setCurrentTab('profile')" class="flex items-center space-x-4 rounded-full  mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'profile' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-12 h-12 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                            <path :fill="currentTab === 'profile' ? '#fff' : '#000'" d="M14.77 20.462h5.692v-.69q-.53-.633-1.275-.972q-.746-.338-1.571-.338t-1.572.338t-1.275.971zm2.846-2.846q.528 0 .899-.37q.37-.371.37-.9t-.37-.899t-.9-.37q-.528 0-.899.37q-.37.37-.37.9q0 .528.37.898t.9.37M11.973 9.5q-1.046 0-1.773.727T9.473 12q0 .816.435 1.427q.434.612 1.13.904q.02-.267.061-.523t.145-.47q-.388-.18-.58-.55q-.191-.369-.191-.788q0-.625.437-1.062t1.063-.438q.413 0 .76.207q.348.206.553.55q.18-.105.373-.155q.195-.05.399-.05h.207q-.267-.69-.891-1.121T11.973 9.5M10.134 21l-.361-2.892q-.479-.145-1.035-.454q-.557-.31-.947-.664l-2.668 1.135l-1.865-3.25l2.306-1.739q-.045-.27-.073-.558q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626L3.258 9.126l1.865-3.212L7.771 7.03q.448-.373.97-.673q.52-.3 1.013-.464L10.134 3h3.732l.361 2.912q.575.202 1.016.463t.909.654l2.725-1.115l1.865 3.211l-2.278 1.721q.019.038.019.077t.019.077h-1.179q-.025-.125-.04-.234q-.016-.108-.066-.233l2.227-1.683l-.994-1.7l-2.552 1.07q-.454-.499-1.193-.935q-.74-.435-1.4-.577L13 4h-1.994l-.312 2.689q-.756.161-1.39.52q-.633.358-1.26.985L5.55 7.15l-.994 1.7l2.169 1.62q-.125.336-.175.73t-.05.82q0 .38.05.755t.156.73l-2.15 1.645l.994 1.7l2.475-1.05q.6.606 1.36 1.002t1.615.579V21zm4.52.846q-.529 0-.9-.37t-.37-.899v-5.923q0-.529.37-.9t.9-.37h5.923q.529 0 .899.37t.37.9v5.923q0 .529-.37.899t-.899.37z" />
                        </svg>
    
                        <div class="text-black font-medium">Profile</div>
                    </div>
                </NuxtLink>

                <div @click="setCurrentTab('logout'); logout();" class="flex items-center space-x-4 rounded-full mb-3 hover:outline hover:outline-2 hover:outline-blue-300" :class="currentTab === 'logout' ? 'bg-sky-300 text-zinc-50' : 'bg-gray-200 dark:bg-slate-400'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 flex-shrink-0 ml-1" :class="{ 'ml-4': !isCollapsed }">
                        <g fill="none" :stroke="currentTab === 'logout' ? '#fff' : '#000'" stroke-linecap="round" stroke-width="1.5">
                            <path stroke-linejoin="round" d="M13.477 21.245H8.34a4.92 4.92 0 0 1-5.136-4.623V7.378A4.92 4.92 0 0 1 8.34 2.755h5.136" />
                            <path stroke-miterlimit="10" d="M20.795 12H7.442" />
                            <path stroke-linejoin="round" d="m16.083 17.136l4.404-4.404a1.04 1.04 0 0 0 0-1.464l-4.404-4.404" />
                        </g>
                    </svg>

                    <div class="text-black font-medium">Logout</div>
                </div>
                
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 w-full overflow-auto rounded-xl bg-zinc-100 ml-2 mt-2 mb-2 p-6 dark:bg-slate-700">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useUserStore} from '@/stores/authStore';
import { useBadgeStore } from '@/stores/notificationStore';

const router = useRouter();
const supabase = useSupabaseClient();
const authUser = useUserStore();

const isCollapsed = ref(false);
const currentTab = ref();

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};

const setCurrentTab = (tab) => {
    currentTab.value = tab;
}

const logout = async () => {
    const { error } = await supabase.auth.signOut()

    await authUser.signOut();
    
    if (!error) {
        router.push('/');
    }
}
</script>
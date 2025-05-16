
<template>
    <div class="card">
        <Tabs value="/dashboard">
            <TabList>
                <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                            <i :class="tab.icon" />
                            <span>{{ tab.label }}</span>
                        </a>
                    </router-link>
                </Tab>
            </TabList>
        </Tabs>
    </div>
</template>

<script setup>
const props = defineProps({
    id: { type: String },
})


const items = ref([
    { route: `/patients/${props.id}/diagnosis`, label: 'Diagnosis', icon: 'pi pi-home' },
    { route: `/patients/${props.id}/medical-history`, label: 'Medical History', icon: 'pi pi-chart-line' },
    { route: `/patients/${props.id}/appointments`, label: 'Appointments', icon: 'pi pi-list' },
    { route: `/patients/${props.id}/visit-history`, label: 'Visit History', icon: 'pi pi-inbox' }
]);
</script>

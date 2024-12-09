import { defineStore } from 'pinia'

export const useBadgeStore = defineStore('badge',() => {
    const badgeCount = ref({
        patients: 0,
        queue: 0,
        schedule: 0,
    });

    const getBadgeCount = computed(() => (badgeName: string) => badgeCount.value[badgeName as keyof typeof badgeCount.value] );

    function fetchBadgeCount() {
        badgeCount.value['patients']++;
        badgeCount.value['queue']++;
        badgeCount.value['schedule']++;
    }

    return { badgeCount, getBadgeCount, fetchBadgeCount };
});
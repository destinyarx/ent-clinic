import { data } from "autoprefixer";

export const useBadgeCountStore = defineStore('badgeCount', () => {
    const patientsCount = ref<number>(0);
    const queueCount = ref<number>(0);
    const openPatientsCount = ref<number>(0);
    const diagnosisCount = ref<number>(0);
    const medicationCount = ref<number>(0);


    const setPatientsCount = async () => {
        // TODO: fetch the count via API call
        // const { data } = await $fetch('');

        const { data } = { data: 2 };
        patientsCount.value = data;
    }

    const setQueueCount = async () => {
         // TODO: fetch the count via API call
        // const { data } = await $fetch('');

        const { data } = { data: 2 };
        queueCount.value = data;
    }

    const setOpenPatientsCount = async () => {
         // TODO: fetch the count via API call
        // const { data } = await $fetch('');

        const { data } = { data: 2 };
        openPatientsCount.value = data;
    }
    
    const setDiagnosisCount = async () => {
         // TODO: fetch the count via API call
        // const { data } = await $fetch('');

        const { data } = { data: 2 };
        diagnosisCount.value = data;
    }

    const setMedicationCount = async () => {
        // TODO: fetch the count via API call
        // const { data } = await $fetch('');

        const { data } = { data: 2 };
        medicationCount.value = data;
    }

    return {
        patientsCount,
        queueCount,
        openPatientsCount,
        diagnosisCount,
        medicationCount,

        setPatientsCount,
        setQueueCount,
        setOpenPatientsCount,
        setDiagnosisCount,
        setMedicationCount,
    }
});
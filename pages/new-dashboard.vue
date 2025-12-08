<template>
    <div class="px-4 pb-4 space-y-6 text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
                <h1 class="text-2xl md:text-3xl font-semibold">Clinic Dashboard</h1>
                <p class="text-sm text-slate-300">
                    EMR · ENT Outpatient Clinic · {{ todayLabel }}
                </p>
            </div>
    
            <div class="flex items-center gap-3 text-xs md:text-sm text-slate-300">
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    OPD · No Admissions
                </span>
                <span class="hidden md:inline-block">Last refresh: 5 min ago</span>
            </div>
        </div>
    
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5 shadow-sm">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-xs uppercase tracking-wide text-slate-300">
                        Total Patients Today
                    </p>
                    <p class="mt-2 text-3xl font-bold">
                        32
                    </p>
                    <p class="mt-1 text-xs text-slate-300">
                        Yesterday: <span class="font-medium text-slate-100">28</span>
                    </p>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <div class="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <i class="pi pi-arrow-up-right text-xs"></i>
                        <span>+12%</span>
                    </div>
                    <div class="mt-2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-500/20">
                        <i class="pi pi-chart-line text-sky-400 text-lg"></i>
                    </div>
                </div>
            </div>
            </div>
    
            <div class="bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5 shadow-sm">
                <div class="flex items-start justify-between">
                    <div>
                    <p class="text-xs uppercase tracking-wide text-slate-300">
                        Accepted Patients
                    </p>
                    <p class="mt-2 text-3xl font-bold">
                        14
                    </p>
                    <p class="mt-1 text-xs text-slate-300">
                        Waiting in clinic queue
                    </p>
                    </div>
                    <div class="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500/20">
                    <i class="pi pi-users text-indigo-300 text-lg"></i>
                    </div>
                </div>
            </div>
    
            <div class="bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5 shadow-sm">
                <div class="flex items-start justify-between">
                    <div>
                    <p class="text-xs uppercase tracking-wide text-slate-300">
                        Completed Consultations
                    </p>
                    <p class="mt-2 text-3xl font-bold">
                        18
                    </p>
                    <p class="mt-1 text-xs text-slate-300">
                        Discharged · No admission
                    </p>
                    </div>
                    <div class="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/20">
                    <i class="pi pi-check-circle text-emerald-300 text-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    
            <div class="grid grid-cols-1 md:grid-cols-[2fr,1.3fr] gap-4">
                <div class="flex items-start gap-3 items-center bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5">
                    <div class="mt-1">
                        <i class="pi pi-calendar text-yellow-300 text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-base md:text-lg font-medium">
                            You have <span class="text-yellow-300 font-semibold">8 scheduled patients</span> today.
                        </p>
                        <p class="mt-1 text-xs md:text-sm text-slate-300">
                            First schedule starts at <span class="font-medium text-slate-100">09:00 AM</span>.
                            Last schedule is at <span class="font-medium text-slate-100">05:30 PM</span>.
                        </p>
                    </div>
                </div>
        
                <div class="bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5 flex flex-col gap-3 text-xs md:text-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-slate-300">Walk-in</span>
                        <span class="font-semibold text-slate-100">60%</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div class="h-full bg-sky-400" style="width: 60%;"></div>
                    </div>
            
                    <div class="flex items-center justify-between">
                        <span class="text-slate-300">Scheduled</span>
                        <span class="font-semibold text-slate-100">40%</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div class="h-full bg-emerald-400" style="width: 40%;"></div>
                    </div>
                </div>
            </div>
    
        <div class="grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-4">
            <!-- Chart -->
            <div class="bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-sm font-medium">Patient Flow (Last 7 Days)</p>
                        <p class="text-xs text-slate-300">Design Demo · Hardcoded</p>
                    </div>
                </div>

                <ClientOnly>
                    <Chart
                        type="line"
                        :data="flowChartData"
                        :options="flowChartOptions"
                        class="h-64 w-full"
                    />
                </ClientOnly>
            </div>
    
            <div class="bg-slate-800/90 border border-slate-600 rounded-xl p-4 md:p-5">
            <div class="flex items-center justify-between mb-4">
                <p class="text-sm font-medium">Recent Patients</p>
                <button
                type="button"
                class="text-xs px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                View all
                </button>
            </div>
    
            <div class="space-y-3">
                <div
                v-for="patient in recentPatients"
                :key="patient.id"
                class="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-600/80 transition-colors"
                >
                <div>
                    <p class="text-sm font-medium">
                    {{ patient.name }}
                    </p>
                    <p class="text-xs text-slate-300">
                    {{ patient.chiefComplaint }}
                    </p>
                </div>
    
                <div class="flex flex-col items-end text-right gap-1">
                    <span class="text-xs text-slate-200">
                    {{ patient.time }}
                    </span>
                    <span
                    class="text-[0.65rem] px-2 py-0.5 rounded-full"
                    :class="statusClass(patient.status)"
                    >
                    {{ patient.status }}
                    </span>
                </div>
                </div>
            </div>
    
            </div>
        </div>
  
    </div>
</template>
  
<script setup>
definePageMeta({
    layout: 'authenticated-layout',
    ssr: false
})

import { computed, ref } from "vue";
import Chart from "primevue/chart";

const todayLabel = computed(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
});

const flowChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"],
  datasets: [
    {
      label: "Patients",
      data: [18, 23, 20, 27, 30, 22, 32], 
      borderColor: "#38bdf8",
      backgroundColor: "rgba(56, 189, 248, 0.25)",
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: "#38bdf8",
    }
  ]
};

const flowChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        labels: {
            color: "#ffffff",
            font: { size: 12 }
        }
        }
    },
    scales: {
        x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(148,163,184,0.2)" } // slate-400/20
        },
        y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(148,163,184,0.2)" }
        }
    }
};

const recentPatients = ref([
    {
        id: 1,
        name: "Juan Dela Cruz",
        chiefComplaint: "Ear pain · 2 days",
        time: "09:15 AM",
        status: "Accepted",
    },
    {
        id: 2,
        name: "Maria Santos",
        chiefComplaint: "Throat discomfort",
        time: "09:50 AM",
        status: "In Room",
    },
    {
        id: 3,
        name: "Peter Johnson",
        chiefComplaint: "Allergic rhinitis",
        time: "10:30 AM",
        status: "Done",
    },
    {
        id: 4,
        name: "Angela Ramirez",
        chiefComplaint: "Follow-up check",
        time: "11:05 AM",
        status: "Scheduled",
    },
]);

const statusClass = (status) => {
    switch (status) {
        case "Done":
            return "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40";
        case "In Room":
            return "bg-sky-500/20 text-sky-300 border border-sky-400/40";
        case "Accepted":
            return "bg-indigo-500/20 text-indigo-300 border border-indigo-400/40";
        case "Scheduled":
        default:
            return "bg-amber-500/20 text-amber-300 border border-amber-400/40";
    }
};
</script>

  
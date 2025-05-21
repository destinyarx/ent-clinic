<template>
    <div>
      <nav class="flex space-x-4 border-b border-gray-300">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="activeTab = tab.name"
          :class="[
            'flex items-center px-4 py-2 -mb-px border-b-2 font-medium cursor-pointer',
            activeTab === tab.name
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-zinc-100 hover:text-blue-500 hover:border-blue-500'
          ]"
          type="button"
        >
          <component :is="tab.icon" class="w-5 h-5 mr-2" />
          {{ tab.label }}
        </button>
      </nav>
  
      <!-- Content here -->
      <div class="mt-4">
        <Appointment v-if="activeTab === 'appointment'"/>
        <Diagnosis v-else-if="activeTab === 'diagnosis'"/>
        <Encounters v-else-if="activeTab === 'visitHistory'"/>
        <MedicalHistory v-else-if="activeTab === 'medicalHistory'"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Appointment from './Patient/Appointment.vue';
  import Diagnosis from './Patient/Diagnosis.vue';
  import Encounters from './Patient/Encounters.vue';
  import MedicalHistory from './Patient/MedicalHistory.vue';
  
  // Simple inline SVG icons for demo, you can replace with your preferred icon set
  
  const DiagnosisIcon = {
    template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
  }
  const HistoryIcon = {
    template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
  }
  const AppointmentIcon = {
    template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
  }
  const VisitHistoryIcon = {
    template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><path d="M12 3v18"/></svg>`
  }
  
  const tabs = [
    { name: 'diagnosis', label: 'Diagnosis', icon: DiagnosisIcon },
    { name: 'medicalHistory', label: 'Medical History', icon: HistoryIcon },
    { name: 'appointment', label: 'Appointment', icon: AppointmentIcon },
    { name: 'visitHistory', label: 'Visit History', icon: VisitHistoryIcon },
  ]
  
  const activeTab = ref(tabs[0].name)
  </script>
  
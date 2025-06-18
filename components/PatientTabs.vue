<template>
  <Menubar :model="tabs">
    <!-- Override each item's rendering -->
    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex items-center px-2 py-1" v-bind="props.action">    

        <!-- render icons -->
        <template v-if="item.value === 'diagnosis'">
          <DiagnosisIcon/>
        </template>
        <template v-else-if="item.value === 'medication'">
          <MedicationIcon/>
        </template>
        <template v-else-if="item.value === 'history'">
          <HistoryIcon/>
        </template>
        <template v-else-if="item.value === 'vitalSign'">
          <VitalsIcon/>
        </template>

        <span class="p-menuitem-icon">
          <template v-if="!root">
            <DiagnosisIcon/>
          </template>
        </span>

        <span>{{ item.label }}</span>

        <!-- if an item has submenu -->
        <i 
          v-if="hasSubmenu"
          :class="[ 'pi', root ? 'pi-angle-down ml-auto' : 'pi-angle-right ml-auto' ]"
        ></i>

      </a>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Menubar from 'primevue/menubar';

// Import your SVG icon components:
import DiagnosisIcon from '@/components/icons/DiagnosisIcon.vue';
import MedicationIcon from '@/components/icons/MedicationIcon.vue';
import HistoryIcon from '@/components/icons/HistoryIcon.vue';
import VitalsIcon from './icons/VitalsIcon.vue';

const props = defineProps<{
  id: number,
  status: string|undefined
}>();

const emit = defineEmits(['setCurrentTab'])

const tabs = ref([
  {
    value: 'diagnosis',
    label: 'Diagnosis',
    icon: DiagnosisIcon,
    command: () => {
      console.log('Diagnosis clicked');
      emit('setCurrentTab', 'diagnosis');
    }
  },
  {
    value: 'vitalSign',
    label: 'Vitals',
    command: () => {
      console.log('Diagnosis clicked');
      emit('setCurrentTab', 'vitals');
    }
  },
  {
    value: 'medication',
    label: 'Medication',
    command: () => {
      console.log('Medication clicked');
      emit('setCurrentTab', 'medication');
    }
  },
  {
    value: 'history',
    label: 'History',
    items: [
          {
              label: 'Medical',
              command: () => {
                emit('setCurrentTab', 'medicalHistory');
              }
          },
          {
              label: 'Encounter',
              command: () => {
                emit('setCurrentTab', 'encounterHistory');
              }
          }
      ]
  }
]);
</script>

<template>
  <Menubar :model="tabs">
    <!-- Override each item's rendering -->
    <template #item="{ item, props, hasSubmenu, root }">
      <a v-ripple class="flex items-center px-2 py-1" v-bind="props.action">    

        <!-- render icons -->
        <template v-if="item.name === 'diagnosis'">
          <DiagnosisIcon/>
        </template>
        <template v-else-if="item.name === 'medication'">
          <MedicationIcon/>
        </template>
        <template v-else-if="item.name === 'history'">
          <HistoryIcon/>
        </template>

        <!-- If you want a fallback (no icon), you can omit the <component> -->
        <span>{{ item.label }}</span>
        <!-- If this item has a submenu, keep PrimeVue's built-in arrow -->
        <i
          v-if="hasSubmenu"
          :class="[
            'pi',
            root ? 'pi-angle-down ml-auto' : 'pi-angle-right ml-auto'
          ]"
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

const props = defineProps<{
  id: string,
  status: string|undefined
}>();

const tabs = ref([
  {
    name: 'diagnosis',
    label: 'Diagnosis',
    command: () => {
      console.log('Diagnosis clicked');
    }
  },
  {
    name: 'medication',
    label: 'Medication',
    command: () => {
      console.log('Medication clicked');
    }
  },
  {
    name: 'history',
    label: 'History',
    command: () => {
      console.log('History clicked');
    }
  }
]);
</script>

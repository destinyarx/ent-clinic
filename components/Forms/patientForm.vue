<template>
    <div class="flex flex-col text-lg">
        <div class="flex flex-row mb-8">
            <div class="w-1/3 mr-5">
                <InputText v-model="props.form.firstName" variant="outlined" placeholder="First Name"  class="w-full"/>
            </div>

            <div class="w-1/3 mr-5">
                <InputText v-model="props.form.middleName" variant="outlined" placeholder="Middle Name" class="w-full"/>
            </div>

            <div class="w-1/3">
                <InputText v-model="props.form.lastName" variant="outlined" placeholder="Last Name" class="w-full"/>
            </div>
        </div>

        <div class="flex flex-row justify-between mb-8">
            <div class="w-1/3 mr-5">
                <Select 
                    v-model="props.form.gender" 
                    :options="genderOptions" 
                    optionLabel="name" 
                    optionValue="code" 
                    placeholder="Gender" 
                    class="w-full text-base"
                />
            </div>

            <div class="w-1/3 mr-5">
                <DatePicker v-model="props.form.birthdate" showIcon class="w-full text-base"/>
            </div>

            <div class="w-1/3">
                <InputNumber 
                    v-model="props.form.contactNumber" 
                    :useGrouping="false" 
                    variant="outlined" 
                    placeholder="Contact Number" 
                    class="w-full" 
                />
            </div>
        </div>

        <div class="w-full mb-8">
            <InputText 
                v-model="props.form.address" 
                variant="outlined" 
                placeholder="Address" 
                class="w-full"
            />
        </div>

        <Message severity="secondary" size="small" variant="simple" class="-mb-2">
            <p class="text-xs italic mb-2">
                Type an allergy and press <span class="font-semibold">Enter</span> to add it. Example: <em>Peanuts</em>, <em>Dust</em>, <em>Seafood</em>, <em>Penicillin</em>.
            </p>
        </Message>
        
        <div class="flex flex-col flex-wrap gap-2 w-full mb-8">
            <AutoComplete
                v-model="allergy"
                @complete="searchAllergy"
                @keydown.enter.prevent="addAllergy"
                :suggestions="filteredAllergies"
                placeholder="Enter or select an allergy"
                class="w-full sm:w-30rem"
                dropdown
            />

            <div class="flex flex-wrap gap-2 w-full text-xs">
                <Chip
                    v-for="item in props.form.allergies"
                    :key="item"
                    :label="item"
                    removable
                    @remove="removeAllergy(item)"
                />
            </div>
        </div>


        <div class="flex justify-center">
            <Button @click="props.action === 'insert' ? addPatient() : updatePatient()" severity="success" :label="props.action === 'insert' ? 'Add Patient' : 'Update Patient'" class="mt-5" />
        </div>

        <div v-if="loading" class="text-cyan-400 text-lg mt-5">
            loading....
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    action: string,
    form: Object
}>();

const emit = defineEmits(['processDone']);

const loading = ref(false);
const genderOptions = ref([
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Choose not to disclose', code: 'X' },
]);

// for managing allergies state
const allergy = ref('');
const filteredAllergies = ref<string[]>([]);
const allAllergies = ref<string[]>([               
  'Peanuts', 'Shellfish', 'Dust', 'Pollen', 'Penicillin', 'Eggs', 'Milk', 'Soy', 'Wheat', 'Latex', 'Mold', 'Bee stings'
]);

// Search matching suggestions
const searchAllergy = (event: { query: string }) => {
  const query = event.query.toLowerCase()
  filteredAllergies.value = allAllergies.value.filter(item =>
    item.toLowerCase().includes(query)
  )
}

const addAllergy = () => {
  const trimmed = allergy.value.trim();

  console.log(props.form.allergies)

  if (trimmed && !props.form.allergies.includes(trimmed)) {
    props.form.allergies.push(trimmed);
    allergy.value = '';
  }
}

const removeAllergy = (item: string) => {
    props.form.allergies = props.form.allergies.filter(a => a !== item)
}

const addPatient = async () => {
    loading.value = true

    try {
        const response = await $fetch('/api/patient/details/add', {
            method: 'POST',
            // headers: {
            //     "Authorization": `Bearer ${token}`,
            //     "Content-Type": "application/json",
            // },
            body: {
                patientData: props.form
            }
        })  
        emit('processDone');
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}

const updatePatient = async () => {
    loading.value = true;

    await $fetch('/api/patient/details/update', {
        method: 'POST',
        body: {
            patientData: props.form
        }
    }).then(response => {
        console.log(response.data)
    }).catch(error => {
        console.log(error)
    })
    
    emit('processDone');
    loading.value = false;
}
</script>
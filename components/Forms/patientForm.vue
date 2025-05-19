<template>
    <div class="flex flex-col text-lg">
        <div class="flex flex-row mb-8">
            <div class="flex flex-row flex-wrap w-1/3 mr-5">
                <label for="contact" class="text-sm font-light mb-1">
                    First Name
                </label>
                <InputText v-model="props.form.firstName" variant="filled" class="w-full"/>
            </div>

            <div class="flex flex-row flex-wrap w-1/3 mr-5">
                <label for="contact" class="text-sm font-light mb-1">
                    Middle Name
                </label>
                <InputText v-model="props.form.middleName" variant="filled" class="w-full"/>
            </div>

            <div class="flex flex-row flex-wrap w-1/3">
                <label for="contact" class="text-sm font-light mb-1">
                    Last Name
                </label>
                <InputText v-model="props.form.lastName" variant="filled" class="w-full"/>
            </div>
        </div>

        <div class="flex flex-row justify-between mb-8">
            <div class="flex flex-row flex-wrap w-1/3 mr-5">
                <label for="gender" class="text-sm font-light mb-1">
                    Gender
                </label>
                <Select 
                    v-model="props.form.gender" 
                    :options="genderOptions" 
                    optionLabel="name" 
                    optionValue="code" 
                    placeholder="Gender" 
                    name="gender"
                    class="w-full text-base"
                />
            </div>

            <div class="flex flex-row flex-wrap w-1/3 mr-5">
                <label for="birthdate" class="text-sm font-light mb-1">
                    Birthdate
                </label>

                <DatePicker v-model="props.form.birthdate" showIcon class="w-full text-base"/>
            </div>

            <div class="flex flex-row flex-wrap w-1/3">
                <label for="contact" class="text-sm font-light mb-1">
                    Contact Number
                </label>
                <InputText 
                    v-model="props.form.contactNumber" 
                    variant="outlined" 
                    placeholder="e.g., 09123456789"                    
                    class="w-full" 
                />
            </div>
        </div>

        <div class="mb-8">
            <label for="contact" class="text-sm font-light mb-1">
                Address
            </label>
            <InputText v-model="props.form.address" variant="filled" class="w-full"/>
        </div>

        <Message severity="secondary" size="small" variant="simple" class="-mb-1">
            <span>
                Allergy
            </span>
            <span class="text-xs italic mb-2">
                <span class="text-yellow-400 ml-2">*</span>
                Type or select an allergy and press <span class="font-semibold">Enter</span> to add it.
                <span class="text-yellow-400">*</span>  
            </span>
        </Message>
        
        <div class="flex flex-col flex-wrap gap-2 w-full mb-8">
            <div class="flex flex-row gap-2 w-full mb-2">
                <AutoComplete
                    v-model="allergy"
                    @complete="searchAllergy"
                    @keydown.enter.prevent="addAllergy"
                    :suggestions="filteredAllergies"
                    placeholder="Enter or select an allergy"
                    class="w-[55vw]"
                    dropdown
                />

                <InputText 
                    v-model="props.form.occupation" 
                    variant="outlined" 
                    placeholder="Occupation" 
                    class="w-[45vw]"
                />
            </div>

            <div class="flex flex-wrap gap-2 items-center w-full text-xs">
                <span v-if="props.form.allergies.length">
                    <Badge class="bg-neutral-400 rounded-full">
                        {{ props.form.allergies.length === 1 ? 'Allergy' : 'Allergies'  }}

                        <Badge 
                            :value="props.form.allergies.length" 
                            size="small"
                            class="rounded-full bg-blue-300 ml-1"
                        >
                        </Badge>
                    </Badge>
                </span>


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
const { allergies } = useConstants();

const loading = ref(false);
const genderOptions = ref([
    { name: 'Male', code: 'M' },
    { name: 'Female', code: 'F' },
    { name: 'Choose not to disclose', code: 'X' },
]);

// for managing allergies state
const allergy = ref('');
const filteredAllergies = ref<string[]>([]);


// Search matching suggestions
const searchAllergy = (event: { query: string }) => {
  const query = event.query.toLowerCase()
  filteredAllergies.value = allergies().filter(item =>
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
        emit('processDone', 'add');
    } catch (error) {
        console.log(error)
    }

    loading.value = false
}

const updatePatient = async () => {
    loading.value = true;

    await $fetch('/api/patient/details/update', {
        method: 'PUT',
        body: { patientData: props.form }
    }).then(response => {
        console.log(response.data)
    }).catch(error => {
        console.log(error)
    })
    
    emit('processDone', 'update');
    loading.value = false;
}
</script>
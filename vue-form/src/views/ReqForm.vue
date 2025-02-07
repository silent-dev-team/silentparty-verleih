<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import TextInput from '../components/TextInput.vue';
import SelectInput from '../components/SelectInput.vue';
import { useFormStore } from '../store/formStore';
import { storeToRefs } from 'pinia';



const formStore = useFormStore();
const tage = ref(1);
const inThreeDays = new Date();
const in8Months = new Date();

const {rentTo, rentFrom} = storeToRefs(formStore);

const date = computed({
  get: () =>{ if(rentFrom.value && rentTo.value){return [rentFrom.value, rentTo.value]} else {return null}},
  set: (value: Date[]) => {
    formStore.rentFrom = value[0];
    formStore.rentTo = value[1];
  }
})

const isPicking = ref(false);
function pickStartDate () {
  isPicking.value = true;
}
function pickEndDate() {
  isPicking.value = false;
}

onMounted(() => {
  in8Months.setDate(in8Months.getDate() + 240);
  inThreeDays.setDate(inThreeDays.getDate() + 3);
  let in4days = new Date();
  in4days.setDate(in4days.getDate() + 4);
  //datum.value = [inThreeDays, in4days];
});
</script>
<template>
    <div class=" p-4 max-w-[1050px] mx-auto">
    <h2 class="text-2xl font-semibold text-white mb-10">User Information</h2>
  <div class="grid md:grid-cols-2 gap-4 ">
  <TextInput v-model="formStore.firstName" name="Vorname" placeholder="Vorname" required :validate="(value: string)=> value.length > 0" />
  <TextInput v-model="formStore.lastName" name="Nachname" placeholder="Nachname" required  />
  <TextInput class="md:col-span-2" v-model="formStore.organization" name="Organisation" placeholder="Organisation" required :validate="(value: string) => value.length > 0" />

  <div class="flex md:col-span-2 gap-4" >
  <TextInput class="grow-4" v-model="formStore.street" name="Straße" placeholder="Straße" required :validate="(value: string) => value.length > 0" />
  <TextInput class="max-w-20" v-model="formStore.number" name="Hausnr" placeholder="1A" required :validate="(value: string) => value.length > 0" />
  </div>
  <TextInput class="" v-model="formStore.plz" name="Postleitzahl" placeholder="Postleitzahl" required :validate="(value: string) => value.length > 0" />
  <TextInput class="" v-model="formStore.city" name="Ort" placeholder="Ort" required :validate="(value: string) => value.length > 0" />
  <TextInput class="md:col-span-2" v-model="formStore.email" name="Email" placeholder="Email" required :validate="(value: string) => value.length > 0" />


  
  
  </div>
  <hr class="h-px col-span-2 my-8 bg-gray-600 border-0 dark:bg-gray-700">
  <h2 class="text-2xl font-semibold text-white mb-2">Ausleihzeitraum</h2>
  <p class="text-white mb-5">In welchem Zeitraum wollt Ihr die Kopfhörer ausleihen?</p>
  {{ isPicking }}
  <div class="flex mb-4 justify-center content-center">
    <div class="border-2  rounded-lg overflow-hidden" :class="{'border-red-500': !formStore.rentFrom || !formStore.rentTo || isPicking}">
   <VueDatePicker @range-start="pickStartDate" @range-end="pickEndDate" required range v-model="date" :enable-time-picker="false" multi-calendars :inline="{ input: false }" no-today auto-apply dark :min-date="inThreeDays" :max-date="in8Months" />


</div>  

</div>
<SelectInput v-model="formStore.rentDays" :options="['1','2','3','4','5','mehr']" name="Anzahl Veranstaltungstage" required  />
<hr class="h-px col-span-2 my-8 bg-gray-600 border-0 dark:bg-gray-700">

<div class="grid grid-cols-2 gap-4">
  <SelectInput :options="[20,40,80,120,160,200,240,280,320,400,500]" v-model.number="formStore.hp_count" name="Anzahl Kopfhörer"  required/>
  <SelectInput :options="[1,2,3]" v-model="formStore.sr_count" name="Anzahl Sender"  required  />
  
  </div>

  <hr class="h-px col-span-2 my-8 bg-gray-600 border-0 dark:bg-gray-700">
  <div class="flex justify-end">
{{ formStore.isValid  }}
<button class="btn btn-blue"  :disabled="(!formStore.isValid )|| isPicking" @click="formStore.storeRequest()">Jetzt Anfragen!</button>
</div>
</div>
</template>
<script setup lang="ts">
import { computed, defineModel, ref } from 'vue'

const model = defineModel<string|number>()
const probs = defineProps<{
    required: boolean,
    disabled?: boolean,
    name: string,
    placeholder?: string,
    options: string[]|number[],
    validate?: Function,
    class?: string
}>();
defineEmits(['isValid'])

const isToched = ref(false);
const isValid = computed(() => {
    if (probs.required && (!model.value || model.value.toString().length == 0)) {
        return false;
    }
    if (probs.validate) {
        return probs.validate(model.value)
    }
    return true
})
const classes = computed(() => {
    return { 'border-red-500': !isValid.value && isToched.value }
})
</script>

<template>
    <div :class="probs.class">
    <label class="block mb-2 text-sm font-medium text-white" :for="probs.name">
        {{ probs.name }} <span class="text-red-500"> {{ probs.required ? '*' : '' }} </span> 
    </label>
    <select 
        class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-red-500 focus:border-red-500"
        :class="classes" v-model="model" @blur="isToched = true" :placeholder="probs.placeholder" :id="probs.name" >
        <option value="" disabled selected class="hidden" >{{ probs.placeholder }}</option>
        <option v-for="option in probs.options" :value="option">{{ option }}</option>
    </select>
    <p v-if="!isValid && isToched" class="text-red-500 text-xs italic">Please fill out this field.</p>
</div>
</template>

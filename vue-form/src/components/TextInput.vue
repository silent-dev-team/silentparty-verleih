<script setup lang="ts">
import { computed, defineModel, ref } from 'vue'

const model = defineModel<string>()
const probs = defineProps<{
    required: boolean,
    disabled?: boolean,
    name: string,
    placeholder: string,
    validate?: Function,
    class?: string
}>();
const emit = defineEmits(['isValid'])

const isToched = ref(false);
const isValid = computed(() => {
    if (probs.required && (!model.value || model.value.length == 0)) {
        emit('isValid', false)
        return false;
    }
    if (probs.validate) {
        let v = probs.validate(model.value);
        emit('isValid', v);
        return v;
    }
    emit('isValid', true);
    return true;
})
const classes = computed(() => {
    return { 'border-red-500': !isValid.value && isToched.value, 'bg-red-500/20': !isValid.value && isToched.value, 'placeholder-red-500/40': !isValid.value && isToched.value }
})
</script>

<template>
    <div :class="probs.class">
    <label class="block mb-2 text-sm font-medium text-white" :for="probs.name">
        {{ probs.name }} <span class="text-red-500"> {{ probs.required ? '*' : '' }} </span> 
    </label>
    <input type="text"
        class="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-red-500 focus:border-red-500"
        :class="classes" v-model="model" @blur="isToched = true" :placeholder="probs.placeholder" :id="probs.name" />
    <p v-if="!isValid && isToched" class="text-red-500 text-xs italic">Please fill out this field.</p>
</div>
</template>

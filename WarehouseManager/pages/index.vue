<script setup lang="ts">

const text = 'Hello World'
const counter = ref<number>(0)

const reset = () => {
  counter.value = 0
}

</script>

<template>
  <div>
    <div class="text-center">
      <h1>Index page</h1>
      <p>{{ text }}</p>
      <p>Counter: {{ counter }}</p>
      <v-btn class="mx-2" @click="counter++">+1</v-btn>
      <v-btn class="mx-2" @click="reset">Reset</v-btn>
    </div>
    <NuxtWelcome />
  </div>
</template>
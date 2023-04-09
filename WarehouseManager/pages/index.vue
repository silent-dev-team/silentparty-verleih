import { useCounterStore } from '../stores/sharedCounter';
<script setup lang="ts">
import { useCounterStore } from '../stores/sharedCounter';

const sharedCounter = useCounterStore();

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
      <v-card class="mx-auto my-3 pa-5" width="300px">
        <p>Counter: {{ counter }}</p>
        <v-btn class="mx-2" @click="counter++">+1</v-btn>
        <v-btn class="mx-2" @click="reset">Reset</v-btn>
      </v-card>
      <v-card v-for="i in [1,2]" :key="i" class="mx-auto my-3 pa-5" width="300px">
        <p>Shared Counter: {{ sharedCounter.count }}</p>
        <v-btn class="mx-2" @click="sharedCounter.increment()">Shared +1</v-btn>
        <v-btn class="mx-2 my-1" @click="sharedCounter.reset()">Shared Reset</v-btn>
      </v-card>
    </div>
    <NuxtWelcome />
  </div>
</template>
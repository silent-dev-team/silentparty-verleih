<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <h1 class="text-center ma-5">HP Manager</h1>
  <div class="d-flex justify-space-around ma-5">
    <v-btn color="blue" @click="router.push('/hp2box')">HP mit Box verbinden</v-btn>
  </div>
</template>
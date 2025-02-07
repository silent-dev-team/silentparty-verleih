<script setup lang="ts">
import { useFormStore } from './store/formStore';
import ReqForm from './views/ReqForm.vue';

const formStore = useFormStore();
</script>


<template>
  <ReqForm v-if="!formStore.sendet"></ReqForm>
  <div v-else-if="!formStore.success" class="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">

    <h1 class="text-2xl mb-4 font-semibold text-white">Ihre Anfrage wird Gesendet!</h1>
  <div class="relative flex items-center h-[190px] mb-4 justify-center">
  <img src="./assets/headphone.svg"  alt="loading" class="w-20 h-20 self-center pulse" />
  <svg  class="absolute top-0 w-[190px] h-[190px]" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <circle class="spin " cx="400" cy="400" fill="none"
    r="320" stroke-width="90" stroke="#fff"
    stroke-dasharray="697 1400"
    stroke-linecap="round" />
  
</svg>
</div>
    <p class="text-white">Bitte Warten sie!</p>
  </div>
  <div v-else class="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
    <svg
    width="115px"
    height="115px"
    viewBox="0 0 133 133"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <g
        id="check-group"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
    >
            <circle
            id="filled-circle"
            fill="#07b481"
            cx="66.5"
            cy="66.5"
            r="54.5"
        />
        <circle
            id="white-circle"
            fill="#111827"
            cx="66.5"
            cy="66.5"
            r="55.5"
        />
        <circle
            id="outline"
            stroke="#07b481"
            stroke-width="4"
            cx="66.5"
            cy="66.5"
            r="54.5"
        />
        <polyline
            id="check"
            stroke="#FFFFFF"
            stroke-width="5.5"
            points="41 70 56 85 92 49"
        />
    </g>
</svg>
    <h1 class="text-2xl mb-4 font-semibold text-white">Ihre Anfrage wurde Gesendet!</h1>
    <p class="text-white">Wir werden uns in Kürze bei Ihnen melden.</p>
  </div>
</template>
<style>
  @keyframes pulse {
    from{
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    to{
      transform: scale(1);
      opacity: 0.8;
    }

  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .pulse{
    animation: pulse 1s linear infinite;
  }
  .spin {
    transform-origin: center;
    animation: spin 1s linear infinite;
  }

  #check-group {
    animation: 0.32s ease-in-out 1.03s check-group;
    transform-origin: center;
}

#check-group #check {
    animation: cubic-bezier(0.65, 0, 1, 1) 0.8s forwards check;
    stroke-dasharray: 0, 75px;
    stroke-linecap: round;
    stroke-linejoin: round;
}

#check-group #outline {
    animation: 0.38s ease-in outline;
    transform: rotate(0deg);
    transform-origin: center;
}

#check-group #white-circle {
    animation: 0.35s ease-in 0.35s forwards circle;
    transform: none;
    transform-origin: center;
}

@keyframes outline {
  from {
    stroke-dasharray: 0, 345.576px;
  }
  to {
    stroke-dasharray: 345.576px, 345.576px;
  }
}
@keyframes circle {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}
@keyframes check {
  from {
    stroke-dasharray: 0, 75px;
  }
  to {
    stroke-dasharray: 75px, 75px;
  }
}
@keyframes check-group {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.09);
  }
  to {
    transform: scale(1);
  }
}
</style>

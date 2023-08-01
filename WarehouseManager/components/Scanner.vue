<script setup lang="ts">
import QrScanner from 'qr-scanner';
import { Modi } from '../types/util';


let props = defineProps<{
  showSettings?: boolean
}>()

const emit = defineEmits<{
  onScan: [value: string]
  results: [value: string[]]
  'update:showSettings': [value: boolean]
}>()

let mode = $ref<Modi>('add'); // null, add, remove

let cams = $ref<QrScanner.Camera[]>([]);
let qrScanner = $ref<QrScanner>();

let blink = $ref(false);
let flip = $ref(false);

let results = $ref<string[]>([]);

if (process.client) {
  QrScanner.listCameras(true).then(devices => {
    cams = devices;
    console.log(devices);
  });

  const vid = window.document.getElementById('qr-video')!;
  qrScanner = new QrScanner(vid, result => {
    if (result instanceof Error) return;
    if ( mode == 'add' ){
      if (results.includes(result)) return;
      results.unshift(result);
      emit('onScan', result);
      emit('results', results);
      blink = true;
      setTimeout(() => blink = false, 300);
    } else if ( mode == 'remove' ) {
      results = results.filter(item => item != result);
      emit('results', results);
    }
  });
  qrScanner.start();
}
</script>

<template>
  {{ props }}
  <div :class="`frame ${flip?'flip':''}`">
    <video id="qr-video" :class="`video ${blink?'blink':''}`"></video>
  </div>
  <div class="mode">
    <v-btn v-if="mode != 'remove' && mode != null" class="mx-2" icon="mdi-plus-circle" variant="plain" color="success" @click="mode = 'remove'"></v-btn>
    <v-btn v-if="mode != 'add' && mode != null" class="mx-2" icon="mdi-minus-circle" variant="plain" color="error" @click="mode = 'add'"></v-btn>
  </div>
  <div class="history">
    <div v-for="item, i in results">
      <v-card :class="`mx-auto my-1 text-center toast ${i==0?'big':'0'}`" :style="`background-color: rgba(255,255,255,${1 - i*0.2}); color: rgba(1,1,1,${1 - i*0.15});`">
        <p>{{ item }}</p>
      </v-card>
    </div>
  </div>
  <v-dialog
      v-model="props.showSettings"
      width="auto"
    >
      <v-card width="800px" max-width="90%">
        <v-card-title>Settings</v-card-title>
        <v-select
          class="ma-5"
          :items="cams.map(cam => cam.label)"
          @update:model-value="qrScanner!.setCamera(cams.find(el => el.label == $event)!.id)"
          label="Select a camera"
          variant="outlined"
        />
        <v-card-actions>
          <v-btn @click="flip = !flip">flip</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style scoped>
frame {
  height: 100vh;
  position: fixed;
}
.video {
  height: 100vh;
  position: fixed;
  transition: all 0.15s ease-in-out; 
  filter:brightness(1);
}

.flip {
  -moz-transform: scale(-1, 1);
  -webkit-transform: scale(-1, 1);
  -o-transform: scale(-1, 1);
  -ms-transform: scale(-1, 1);
  transform: scale(-1, 1);
}

.blink {
  filter:brightness(5);
}

.history {
  position: fixed;
  top: 0;
  right: 0;
  width: 100px;
  height: 30vh;
  background-color: transparent;
  overflow: hidden;
}

.mode {
  position: fixed;
  top: 5px;
  left: 0;
  width: 100px;
  height: 30vh;
  background-color: transparent;
  overflow: hidden;
}
.big{
  animation: scaleDown 0.5s ease-in-out;
}

@keyframes scaleDown {
  0% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
.card {
  background-color: rgba(255,255,255,1);
  color: rgba(1,1,1,1);
  left: 2.5%;
  width: 95%;
  position: absolute;
  top:95%;
}
</style>
<script setup lang="ts">
import QrScanner from 'qr-scanner';
import { Headphone, Box } from '../types/collections';
import { Modi } from '../types/util';
import { type } from '../.nuxt/types/imports';
const { getItems, updateItem } = useDirectusItems();

const headphones = await getItems<Headphone>({
  collection: 'headphones',
  params: {
    fields: ['id','qr','box'],
    limit: -1
  }
});

const boxes = await getItems<Box>({
  collection: 'boxes',
  params: {
    fields: ['id','qr','box'],
    limit: -1
  }
});

const blink = ref(false);
const flip = ref(false);
const mode = ref<Modi>('add'); // null, add, remove

const dialog = ref(false);

const codes = ref<string[]>([]);

const cams = ref<QrScanner.Camera[]>([]);

const qrScanner = ref<QrScanner>();

const qrHeadphones = computed(() => [ ... new Set(codes.value.filter(item => /^\d+$/.test(item)))]);
const qrBox = computed(() => codes.value.find(item => item.startsWith('K')) || 'keine Box gescannt');

if (process.client) {

  QrScanner.listCameras(true).then(devices => {
    cams.value = devices;
    console.log(devices);
  });

  const vid = window.document.getElementById('qr-video')!;
  qrScanner.value = new QrScanner(vid, result => {
    if (result instanceof Error) return;
    if ( mode.value == 'add' ){
      if (codes.value.includes(result)) return;
      codes.value.unshift(result);
      blink.value = true;
      setTimeout(() => blink.value = false, 300);
    } else if ( mode.value == 'remove' ) {
      codes.value = codes.value.filter(item => item != result);
    }
  });

  qrScanner.value.start();
}

function bind() {
  const boxId = boxes.find(box => box.qr == qrBox.value)!.id;
  for ( let i = 0; i < qrHeadphones.value.length; i++ ) {
    const code = qrHeadphones.value[i];
    const hpId = headphones.find(hp => hp.qr == code)!.id;
    console.log(hpId,'->', boxId);
    updateItem({
      collection: 'headphones',
      id: hpId,
      item: {
        box: boxId
      }
    });
  }
  alert('done');
}

function log(content:any){
  console.log(content);
}

</script>

<template>
    <div :class="`frame ${flip?'flip':''}`">
      <video id="qr-video" :class="`video ${blink?'blink':''}`"></video>
    </div>
    <div class="mode">
      <v-btn v-if="mode != 'remove' && mode != null" class="mx-2" icon="mdi-plus-circle" variant="plain" color="success" @click="mode = 'remove'"></v-btn>
      <v-btn v-if="mode != 'add' && mode != null" class="mx-2" icon="mdi-minus-circle" variant="plain" color="error" @click="mode = 'add'"></v-btn>
    </div>
    <div class="history">
      <div v-for="item, i in codes">
        <v-card :class="`mx-auto my-1 text-center toast ${i==0?'big':'0'}`" :style="`background-color: rgba(255,255,255,${1 - i*0.2}); color: rgba(1,1,1,${1 - i*0.15});`">
          <p>{{ item }}</p>
        </v-card>
      </div>
    </div>
    
    <v-card class="card">
      <v-card-title>HP-Boxes bindings</v-card-title>
      <v-card-text>
        <h3>Box: {{ qrBox }}</h3>
        <h3>Headphones: {{ qrHeadphones.sort().join(', ') }}</h3>
      </v-card-text>
      <v-card-actions id="actions">
        <v-btn color="primary" :disabled="!(qrBox.startsWith('K') && headphones.length != 0)" @click="bind()">bind</v-btn>
        <v-btn color="primary" @click="dialog = true">Settings</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="dialog"
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

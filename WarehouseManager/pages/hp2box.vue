<script setup lang="ts">
import QrScanner from 'qr-scanner';
import { Headphone, Box } from '../types/collections';
import { Modi } from '../types/util';
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

let showSettings = $ref(false);

let dialog = $ref(false);

let results = $ref<string[]>([]);

let cams = $ref<QrScanner.Camera[]>([]);

let qrScanner = $ref<QrScanner>();

const qrHeadphones = $computed(() => [ ... new Set(results.filter(item => /^\d+$/.test(item)))]);
const qrBox = $computed(() => results.find(item => item.startsWith('K')) || 'keine Box gescannt');

function bind() {
  const boxId = boxes.find(box => box.qr == qrBox)!.id;
  for ( let i = 0; i < qrHeadphones.length; i++ ) {
    const code = qrHeadphones[i];
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
  <scanner :show-settings="showSettings" @results="r => results = r"></scanner>
  <v-card class="card">
    <v-card-title>HP-Boxes bindings</v-card-title>
    <v-card-text>
      <h3>Box: {{ qrBox }}</h3>
      <h3>Headphones: {{ qrHeadphones.sort().join(', ') }}</h3>
    </v-card-text>
    <v-card-actions id="actions">
      <v-btn color="primary" :disabled="!(qrBox.startsWith('K') && headphones.length != 0)" @click="bind()">bind</v-btn>
      <v-btn color="primary" @click="showSettings = true">Settings</v-btn>
    </v-card-actions>
    {{ showSettings }}
  </v-card>
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

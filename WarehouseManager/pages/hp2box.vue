<script setup>
import QrScanner from 'qr-scanner';
const { getItems, updateItem } = useDirectusItems();

const getHeadphones = async() => {
  return await getItems({
    collection: 'headphones',
  });
}
const headphones = await getHeadphones();

const getBoxes = async() => {
  return await getItems({
    collection: 'boxes',
  });
}
const boxes = await getBoxes();


const mode = ref('add'); // null, add, remove

const codes = ref([]);

const qrHeadphones = computed(() => [ ... new Set(codes.value.filter(item => /^\d+$/.test(item)))]);
const qrBox = computed(() => codes.value.find(item => item.startsWith('K')) || 'keine Box gescannt');

if (process.client) {
  const vid = window.document.getElementById('qr-video');
  const qrScanner = new QrScanner(vid, result => {
    console.log(result);
    if ( mode.value == 'add' ){
      codes.value.unshift(result);
    } else if ( mode.value == 'remove' ) {
      codes.value = codes.value.filter(item => item != result);
    }
  });
  qrScanner.start();
}

function bind() {
  console.log(qrBox.value, qrHeadphones.value);
  const boxId = boxes.find(item => item.qr == qrBox.value).id;
  for ( let i = 0; i < qrHeadphones.value.length; i++ ) {
    const code = qrHeadphones.value[i];
    const hpId = headphones.find(item => item.qr == code).id;
    console.log(hpId,'->', boxId);
    updateItem({
      collection: 'headphones',
      id: hpId,
      item: {
        box: boxId
      }
    });
  }
}

</script>

<template>
    <video id="qr-video" class="video"></video>
    <div class="mode">
      <v-btn v-if="mode != 'remove' && mode != 'null'" class="mx-2" icon="mdi-plus-circle" variant="plain" color="success" @click="mode = 'remove'"></v-btn>
      <v-btn v-if="mode != 'add' && mode != 'null'" class="mx-2" icon="mdi-minus-circle" variant="plain" color="error" @click="mode = 'add'"></v-btn>
    </div>
    <div class="history">
      <div v-for="item, i in codes">
        <v-card class="mx-auto my-1 text-center" :style="`background-color: rgba(255,255,255,${1 - i*0.2}); color: rgba(1,1,1,${1 - i*0.15});`">
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
      </v-card-actions>
    </v-card>
</template>

<style scoped>
.video {
  height: 100vh;
  position: fixed;
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

.card {
  background-color: rgba(255,255,255,1);
  color: rgba(1,1,1,1);
  left: 2.5%;
  width: 95%;
  position: absolute;
  top:95%;
}
</style>

<script setup>
import QrScanner from 'qr-scanner';
const { getItems, getItemById } = useDirectusItems();

const mode = ref('add'); // null, add, remove

const items = ref([]);

if (process.client) {
  const vid = window.document.getElementById('qr-video');
  const qrScanner = new QrScanner(vid, result => {
    console.log(result);
    items.value.unshift({ code: result });
  });
  qrScanner.start();
}


</script>

<template>
    <video id="qr-video" class="video"></video>
    <div class="mode">
      <v-btn v-if="mode != 'remove' && mode != 'null'" class="mx-2" icon="mdi-plus-circle" variant="plain" color="success" @click="mode = 'remove'"></v-btn>
      <v-btn v-if="mode != 'add' && mode != 'null'" class="mx-2" icon="mdi-minus-circle" variant="plain" color="error" @click="mode = 'add'"></v-btn>
    </div>
    <div class="history">
      <div v-for="item, i in items">
        <v-card class="mx-auto my-1 text-center" :style="`background-color: rgba(255,255,255,${1 - i*0.2}); color: rgba(1,1,1,${1 - i*0.1});`">
          <p>{{ item.code }}</p>
        </v-card>
      </div>
    </div>
    <v-card class="card">
      <v-card-title>Checkout</v-card-title>
      <v-card-actions id="actions">
        <ShowAllItems />
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

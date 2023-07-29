<script setup lang="ts">
import QrScanner from 'qr-scanner';
import { Offer, Order, Box } from '../types/collections';
import { Modi } from '../types/util';
const { getItems, getItemById } = useDirectusItems();

// PROPS
let mode = $ref<Modi>('add'); // null, add, remove
let boxes = $ref<any>([]);

let offer = $ref<Offer>();
let selectedOrder = $ref<string>();

// CONSTRUCTOR
const orders = await getItems<Order>({
  collection: 'order',
  params: {
    filter: {
      status: {
        _eq: "offer_accepted"
      }
    }
  }
});

// METHODS
function loadOffer(orderId:string):void {
  getItemById<Offer>({
    collection: 'offer',
    id: orders.find(order => order.id == orderId)!.offer
  })
  .then(off => {
    offer = off;
  })
}

async function countHeadphonesInBox(boxId:string):Promise<number> {
  const box = await getItemById<Box>({
    collection: 'boxes',
    id: boxId
  });
  return box.headphones.length;
}

// MAIN
if (process.client) {
  const vid = window.document.getElementById('qr-video')!;
  const qrScanner = new QrScanner(vid, result => {
    if (result instanceof Error) return;
    console.log(result);
    boxes.unshift({ code: result });
  });
  qrScanner.start();
}

</script>

<template>
    <video id="qr-video" class="video"></video>
    <div class="mode">
      <v-btn v-if="mode != 'remove' && mode != null" class="mx-2" icon="mdi-plus-circle" variant="plain" color="success" @click="mode = 'remove'"></v-btn>
      <v-btn v-if="mode != 'add' && mode != null" class="mx-2" icon="mdi-minus-circle" variant="plain" color="error" @click="mode = 'add'"></v-btn>
    </div>
    <div class="history">
      <div v-for="item, i in boxes">
        <v-card class="mx-auto my-1 text-center" :style="`background-color: rgba(255,255,255,${1 - i*0.2}); color: rgba(1,1,1,${1 - i*0.1});`">
          <p>{{ item.code }}</p>
        </v-card>
      </div>
    </div>
    <v-card class="card">
      <v-card-title>Checkout</v-card-title>
      <v-card-text>
        {{ orders }}
        {{ selectedOrder }}
        {{ offer }}
      </v-card-text>
      <v-select
        class="mx-3"
        variant="outlined"
        label="Auftrag"
        v-model="selectedOrder"
        :items="orders.map(order => order.organisation)"
        :disabled="orders.length == 0"
      ></v-select>
      <v-btn class="mx-3" color="success" :disabled="selectedOrder == null" @click="loadOffer(orders.find(order => order.organisation == selectedOrder).id)">
        Auftrag laden
      </v-btn>
      <p class="ma-5">
        Kopfhörer: {{ offer?.n_headphones }} <br>
        Sender: {{ offer?.n_transmitter }}
      </p>
      <v-card-actions id="actions">
        
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
../types/collections
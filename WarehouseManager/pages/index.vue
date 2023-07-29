<script setup lang="ts">
const router = useRouter()
let username = $ref<string>('')
let password = $ref<string>('')

let loggedIn = $ref<boolean>(false)

const links = [
  {
    title: 'Link HP und Box',
    img: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg',
    link: '/hp2box'
  },
  {
    title: 'Kopfhörer Ausgabe',
    img: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg',
    link: '/checkout'
  },
  {
    title: 'Kopfhörer Rücknahme',
    img: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg',
    link: '/checkin'
  }
]

</script>

<template>
  <div class="header">
    <div class="textbox">
      <h1>Verleih</h1>
      <v-expand-transition>
      <div class="login" v-if="!loggedIn">
        <v-text-field
          v-model="username"
          label="username"
          outlined
          dense
          hide-details
          class="ma-5"
        />
        <v-text-field
          v-model="password"
          label="password"
          type="password"
          outlined
          dense
          hide-details
          class="ma-5"
        />
        <v-btn 
          outlined
          dense
          hide-details
          class="center mx-5 mb-3"
          @click="loggedIn = true"
          >Einloggen
        </v-btn>
      </div>
    </v-expand-transition>
    </div>
  </div>
  <div>
    <v-col>
      <v-row>
        <v-col v-for="link in links" :key="link.link" cols="12" md="6">
          <v-card class="linkcard mx-auto" max-width="500" @click="router.push(link.link)">
            <v-img class="img" height="100px" cover :src="link.img">
              <v-card-title class="title">{{ link.title }}</v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<style scoped>
h1 {
  font-size: 50px;
  font-weight: bold;
  color: white;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
}
.header{
  background: rgb(2,0,36);
  background: linear-gradient(156deg, rgba(2,0,36,1) 0%, rgba(63,81,181,1) 100%);
  color: white;
  padding: 10px;
  text-align: left;
}

.header .textbox{
  position: relative;
  top: 20%;
  left: 5%;
}

.login{
  width: 90%;
}

.btn {
  color: rgba(63,81,181,1);
  background-color: rgba(63,81,181,1);
}

.linkcard .title {
  color: #f5f5f5;
}

.linkcard .img {
  opacity: 0.8;
  animation: fade-out 0.5s;
}

.linkcard .img:hover {
  opacity: 1;
  animation: fade-in 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

</style>
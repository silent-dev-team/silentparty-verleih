import { createApp } from 'vue'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.use(pinia)
app.mount('#app')

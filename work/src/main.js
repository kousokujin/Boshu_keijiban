import { createApp } from 'vue'
//import { VuelidatePlugin } from '@vuelidate/core'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
//import 'bootstrap/js/dist/modal'
const app = createApp(App);
app.use(VueAxios,axios);
app.use(router);
//app.use(VuelidatePlugin)
//app.use(BootstrapVue);
//app.use(IconsPlugin);

app.mount('#app');

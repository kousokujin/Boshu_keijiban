import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
//import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'


const app = createApp(App);
app.use(VueAxios,axios);
app.use(router);
//app.use(BootstrapVue);
//app.use(IconsPlugin);

app.mount('#app');

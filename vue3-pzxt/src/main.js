import { createApp } from 'vue'
import  './style/style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import { useUserStore } from './stores'
const app = createApp(App)


app.use(pinia)
const userStore = useUserStore();
userStore.restorePermissions();
app.use(router)
app.mount('#app')

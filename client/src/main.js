// import App from './App.vue'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRightFromBracket, faPaperPlane, faListUl , faGear, faEllipsisVertical, faXmark} from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRightFromBracket)
library.add(faPaperPlane)
library.add(faListUl)
library.add(faGear)
library.add(faEllipsisVertical)
library.add(faXmark)



const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createBootstrap())
app.use(router)
app.mount('#app')

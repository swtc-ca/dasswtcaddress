import Vue from 'nativescript-vue'
import Vuex from 'vuex'

import sideDrawer from './modules/sideDrawer'
import swtc from './modules/swtc'
import logger from './modules/logger'

Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

let store = new Vuex.Store({
  modules: {
    sideDrawer,
    logger,
    swtc
  },
  strict: debug
})

Vue.prototype.$store = store

export default store
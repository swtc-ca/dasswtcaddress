import * as applicationSettings from "tns-core-modules/application-settings"
import Vue from 'nativescript-vue'
import Vuex from 'vuex'

import sideDrawer from './modules/sideDrawer'

Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

let store = new Vuex.Store({
  modules: {
    sideDrawer
  },
  state : {
    debug,
    items: [],
    wallets: JSON.parse(applicationSettings.getString('WALLETS') || '[]')
  },
  getters: {

  },
  mutations: {
    addItem: (state, v) => state.items.push(v),
    addWallet: (state, v) => state.wallets.push(v),
    removeWallet: (state, v) => state.wallets.splice(state.wallets.indexOf(v),1),
    saveWallets: (state) => applicationSettings.setString('WALLETS', JSON.stringify(state.wallets)),
  },
  actions: {

  },
  strict: debug
})

Vue.prototype.$store = store

export default store
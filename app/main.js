import Vue from 'nativescript-vue'
import RadListView from 'nativescript-ui-listview/vue'
import routes from '~/router'
import store from '~/store'
import sideDrawer from '~/components/sideDrawer'
import drawerContent from '~/components/drawerContent'
import JingtumBaseLibService from '~/services/JingtumBaseLibService'
const jingtumBaseLibService = new JingtumBaseLibService()

import './styles.scss'

Vue.use(RadListView)
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
Vue.prototype.$routes = routes

if (store.getters.swtcWallet.length === 0) {
  if (store.getters.swtcWallets.length > 0) {
    store.commit('setSwtcWallet', store.getters.swtcWallets[0])
    store.commit('saveSwtcWallet')
  } else {
    store.commit('setSwtcWallet', jingtumBaseLibService.newWallet())
    store.commit('saveSwtcWallet')
  }
}
const SWTCSERVERS = [{ server: "wss://c04.jingtum.com:5020", display: "井通节点04"}, { server: "wss://c05.jingtum.com:5020", display: "井通节点05"}, {server: "ws://swtc.daszichan.com:5020", display: "CA生态节点" }]
if (store.getters.swtcServers.length === 0) {
  console.log("add servers")
  SWTCSERVERS.reverse().forEach( server => store.commit('addSwtcServer', server))
  store.commit('saveSwtcServers')
} else {
  console.log("servers were set")
}

new Vue({
  store,
  render (h){
    return h(sideDrawer, [
      h(drawerContent, {slot: "drawerContent"}),
      h(routes.MineAddress, {slot: "mainContent"})
    ])
  } 
}).$start()

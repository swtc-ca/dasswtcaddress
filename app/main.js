import Vue from 'nativescript-vue'
import RadListView from 'nativescript-ui-listview/vue'
import routes from '~/router'
import store from '~/store'
import sideDrawer from '~/components/sideDrawer'
import drawerContent from '~/components/drawerContent'

import './styles.scss'

Vue.use(RadListView)
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
Vue.prototype.$routes = routes
new Vue({
  store,
  render (h){
    return h(sideDrawer, [
      h(drawerContent, {slot: "drawerContent"}),
      h(routes.MineAddress, {slot: "mainContent"})
    ])
  } 
}).$start()

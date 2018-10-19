import * as applicationSettings from "tns-core-modules/application-settings"
const state = {
    swtcWallets: JSON.parse(applicationSettings.getString('SWTCWALLETS') || '[]')
 }
const getters = {
    getSwtcWallets: (state) => state.swtcWallets
}
const mutations = {
    addSwtcWallet: (state, v) => state.swtcWallets.push(v),
    removeSwtcWallet: (state, v) => state.swtcWallets.splice(state.swtcWallets.indexOf(v),1),
    saveSwtcWallets: (state) => applicationSettings.setString('SWTCWALLETS', JSON.stringify(state.swtcWallets)),
}
export default {
  state,
  getters,
  mutations,
}
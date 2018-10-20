import * as applicationSettings from "tns-core-modules/application-settings"
require('nativescript-nodeify')
const JingtumLib = require('jingtum-lib')
const Wallet = JingtumLib.Wallet
const Remote = JingtumLib.Remote

const newWallet = function () {
    return Wallet.generate()
}
const newRemote = function (server='ws://swtc.daszichan.com:5020', local_sign=true) {
    if (typeof(server) === typeof({})) {
        return new Remote({server: server.server, local_sign: local_sign})
    } else {
        return new Remote({server: server, local_sign: local_sign})
    }
}

const state = {
    swtcWallets: JSON.parse(applicationSettings.getString('SWTCWALLETS') || '[]'),
    swtcServers: JSON.parse(applicationSettings.getString('SWTCSERVERS') || '[]'),
    swtcLedgers: [],
    swtcWallet: null,
    swtcServer: null,
    //swtcRemote: null,
 }
const getters = {
    swtcLedgers: (state) => state.swtcLedgers,
    swtcWallets: (state) => state.swtcWallets,
    swtcWallet: (state) => state.swtcWallet,
    swtcServers: (state) => state.swtcServers,
    swtcServer: (state) => state.swtcServer,
    //swtcRemote: (state) => state.swtcRemote,
}
const mutations = {
    addSwtcLedger: (state, v) => state.swtcLedgers.unshift(v),
    addSwtcWallet: (state, v) => state.swtcWallets.unshift(v),
    removeSwtcWallet: (state, v) => state.swtcWallets.splice(state.swtcWallets.indexOf(v),1),
    setSwtcWallet: (state, v) => state.swtcWallet = v,
    addSwtcServer: (state, v) => state.swtcServers.unshift(v),
    removeSwtcServer: (state, v) => state.swtcServers.splice(state.swtcServers.indexOf(v),1),
    saveSwtcWallets: (state) => applicationSettings.setString('SWTCWALLETS', JSON.stringify(state.swtcWallets)),
    saveSwtcServers: (state) => applicationSettings.setString('SWTCSERVERS', JSON.stringify(state.swtcServers)),
    setSwtcServer: (state, v) => state.swtcServer = v,
}
const actions = {
}
export default {
  state,
  getters,
  mutations,
  actions
}
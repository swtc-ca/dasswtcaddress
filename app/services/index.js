const applicationSettings = require("tns-core-modules/application-settings")
require('nativescript-nodeify')
const JingtumLib = require('jingtum-lib')
const Wallet = JingtumLib.Wallet
const Remote = JingtumLib.Remote

export default class BackendService {
    constructor() {
        console.log('backend service initialized')
    }
    newWallet() {
        return Wallet.generate()
    }
    newRemote(server='ws://swtc.daszichan.com:5020', local_sign=true) {
        if (typeof(server) === typeof({})) {
            return new Remote({server: server.server, local_sign: local_sign})
        } else {
            return new Remote({server: server, local_sign: local_sign})
        }
    }
}
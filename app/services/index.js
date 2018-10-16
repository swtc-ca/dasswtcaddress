const applicationSettings = require("tns-core-modules/application-settings")
require('nativescript-nodeify')
var JingtumBaseLib = require('jingtum-base-lib')
var Wallet = JingtumBaseLib.Wallet

export default class BackendService {
    constructor() {
      console.log('backend service initializing')
      this._wallets = JSON.parse(applicationSettings.getString('WALLETS') || '[]')
      console.log('backend service initialized')
    }
    get wallets() {
        return this._wallets
    }
    set wallets(wallets) {
        this._wallets = wallets
        applicationSettings.setString('WALLETS', JSON.stringify(this._wallets))
    }
    newWallet() {
        return Wallet.generate()
    }
}
const applicationSettings = require("tns-core-modules/application-settings")
require('nativescript-nodeify')
var JingtumBaseLib = require('jingtum-base-lib')
var Wallet = JingtumBaseLib.Wallet

export default class BackendService {
    newWallet() {
        return Wallet.generate()
    }
}
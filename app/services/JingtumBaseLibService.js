import BackendService from './BackendService'
require('nativescript-nodeify/nodeify')
const JingtumBaseLib = require('jingtum-base-lib')
const Wallet = JingtumBaseLib.Wallet

export default class JingtumBaseLibService extends BackendService {
    constructor(v) {
        console.log(`jingtumbase service ${v} initializing`)
        super(v)
        console.log(`jingtumbase service ${v} initialized`)
    }
    newWallet(secret=false) {
        if (secret) {
            return Wallet.fromSecret(secret)
        } else {
            return Wallet.generate()
        }
    }
}
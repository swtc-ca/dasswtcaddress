import JingtumBaseLibService from './JingtumBaseLibService'
require('nativescript-nodeify/nodeify')
const JingtumLib = require('jingtum-lib')
const Remote = JingtumLib.Remote

const options_swt_cny = {
    gets: { currency: 'SWT', issuer: '' },
    pays: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' }
};
const options_cny_swt = {
    gets: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' },
    pays: { currency: 'SWT', issuer: '' }
};
var callbackErrorResult =  (err, result) => {
    if(err) { 
      console.log(err)
    } else {
       console.log(result)
    }
}
var callbackMessage = msg => console.log(msg)

export default class JingtumLibService extends JingtumBaseLibService {
    constructor(v) {
        console.log(`jingtum service ${v} initializing`)
        super(v)
        console.log(`jingtum service ${v} initialized`)
    }
    newRemote(server='ws://swtc.daszichan.com:5020', local_sign=true) {
        if (typeof(server) === typeof({})) {
            return new Remote({server: server.server, local_sign: local_sign})
        } else {
            return new Remote({server: server, local_sign: local_sign})
        }
    }
    connect(remote, cb=callbackErrorResult){
        console.log('START REMOTE CONNECTION:')
        if (!!remote) {
          remote.connect(cb)
        }
    }
    disconnect(remote){
        console.log('END REMOTE CONNECTION:')
        if (!!remote) {
          remote.disconnect()
        }
    }
    requestOffer(remote, wallet, offerType, taker1, taker2, cb=callbackErrorResult) {
        let tx = remote.buildOfferCreateTx({type: offerType, account: wallet.address, taker_gets: taker1, taker_pays: taker2})
        tx.setSecret(wallet.secret)
        tx.submit(cb)
    }
    requestOrderBook(remote, options=options_swt_cny, cb=callbackErrorResult){
        remote.requestOrderBook(options).submit(cb)
    }
    requestAccountOffers(remote,address,cb=callbackErrorResult){
        remote.requestAccountOffers({account: address}).submit(cb)
    }
    requestAccountRelations(remote,address, relation='trust', cb=callbackErrorResult){
        remote.requestAccountRelations({account: address, type: relation}).submit(cb)
    }
    requestAccountTums(remote,address,cb=callbackErrorResult){
        remote.requestAccountTums({account: address}).submit(cb)
    }
    requestAccountTx(remote,address,cb=callbackErrorResult){
        remote.requestAccountTx({account: address}).submit(cb)
    }
    buildPaymentTx(remote, wallet, to, value=1, currency='SWT', issuer='', memo='') {
      var tx = remote.buildPaymentTx({
          account: wallet.address,
          to: to,
          amount: {
              value: value,
              currency: currency,
              issuer: issuer
          }
      })
      tx.setSecret(wallet.secret);
      if (memo) {
        tx.addMemo(memo)
      } else {
        tx.addMemo(`${(new moment()).format('YYYYMMDDHHmmss')}`);
      }
      return tx
    }
    
    pay(remote,wallet, to='jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG', value=1, currency='SWT', issuer='', memo='', cb=callbackErrorResult){
        this.buildPaymentTx(remote, wallet, to, value, currency, issuer, memo).submit(cb)
    }
    queryLedger(remote, hashnum, with_transactions=false,cb=callbackErrorResult){
        remote.requestLedger({ledger_index:hashnum,transactions:with_transactions}).submit(cb)
    }
    queryTransaction(remote, hashnum, cb=callbackErrorResult){
        remote.requestTx({hash:hashnum}).submit(cb)
    }
    onLedger(remote, cb=callbackMessage) {
      if (remote && remote.eventNames().filter( e => e === 'ledger_closed').length === 1) {
        remote.removeListener('ledger_closed', cb)
      } else {
        remote.on('ledger_closed', cb);
      }
    }
    onTransaction(remote, cb=callbackMessage) {
      if (remote && remote.eventNames().filter( e => e === 'transactions').length === 1) {
        remote.removeListener('transactions', cb)
      } else {
        remote.on('transactions', cb);
      }
    }
    requestAccountInfo(remote,address,cb=callbackErrorResult) {
        remote.requestAccountInfo({account: address}).submit(cb)
    }
    requestServerInfo(remote,cb=callbackErrorResult){
      remote.requestServerInfo().submit(cb)
    }
}
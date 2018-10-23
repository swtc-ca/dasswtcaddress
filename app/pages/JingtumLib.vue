<template>
  <Page ref="page" :class="pageClasses" backgroundSpanUnderStatusBar="true">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="井通客户端库">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <StackLayout ~mainContent>
      <StackLayout :visibility="!!wallet ? 'collapse' : 'visible'">
          <ListPicker :items="wallets.map(w => w.address)" v-model="walletIndex" />
          <Button text="选择井通地址" @tap="onWalletSelected" class="btn btn-primary btn-active"/>
      </StackLayout>
      <StackLayout :visibility="!!wallet ? 'visible' : 'collapse'">
        <GridLayout ref="walletRef" columns="80,*,2*,90" rows="36">
          <Label col="0" text="井通" />
          <Label col="1" :text="sequence ? '序号' + sequence : ''" />
          <Label col="2" :text="balance ? '余额' + balance : ''" />
          <Label col="3" :text="!!price ? '价格' + price : ''" />
        </GridLayout>
        <Label :text="' 地址: ' + wallet.address" @onTap="toClipboard(wallet.address)" />
      </StackLayout>
      <StackLayout :visibility="!!server ? 'collapse' : 'visible'">
          <ListPicker :items="servers.map(s => s.display)" v-model="serverIndex" />
          <Button text="选择井通服务器" @tap="onServerSelected" class="btn btn-primary btn-active"/>
      </StackLayout>
      <StackLayout :visibility="!!remote ? 'visible' : 'collapse'">
        <GridLayout ref="remoteRef" columns="100,100,*,80" rows="40">
          <Label col="0" text="井通节点" />
          <Label col="1" :text="remoteStatus ? '已连接': ''" />
          <button col="3" :isEnabled="!remoteConnecting" @tap="onRemoteConnection" :text="!remoteStatus ? '连接' : '断开'" style="width:80;height:40" class="btn btn-primary"/>
        </GridLayout>
        <Label :visibility="!!server ? 'visible' : 'collapse'" :text="'节点: ' + server.display "  />
        <GridLayout ref="queryRef" columns="80,*,80" rows="40" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'">
          <button col="0" row="0" @tap="onQueryLedger" text="查账本" style="width:80;" class="btn btn-primary"/>
          <TextField col="1" row="0" hint="帐本高度/哈希 交易哈希" v-model="qrLedgerTransaction" autocorrect="false"/>
          <button col="2" row="0" @tap="onQueryTransaction" text="查交易" style="width:80;" class="btn btn-primary"/>
        </GridLayout>
        <GridLayout ref="queryRefa" columns="80,*,*,80" rows="40" :visibility="remoteStatus && !remoteConnecting && wallet? 'visible' : 'collapse'">                     
          <button col="0" :isEnabled="remoteStatus && !remoteConnecting" @tap="onWalletBalance" text="查余额" style="width:80" class="btn btn-primary"/>                
          <Button col="3" :isEnabled="remoteStatus && !remoteConnecting && activated" row="1" text="查通证" @tap="onWalletTums()" class="btn btn-primary"  style="width:80;" />
        </GridLayout>
        <GridLayout ref="queryRefb" columns="80,*,*,80" rows="40" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'">                     
          <Button col="0" text="查市场" :isEnabled="remoteStatus && !remoteConnecting" @tap="onOrderBook()" class="btn btn-primary"  style="width:80;" />      
          <button col="3" :isEnabled="remoteStatus && !remoteConnecting" @tap="onRemoteInfo" text="服务器" style="width:80;" class="btn btn-primary"/>           
        </GridLayout>
        <GridLayout ref="paymentRef" columns="80,*,*,80" rows="40,40,40" :visibility="remoteStatus && !remoteConnecting && activated ? 'visible' : 'collapse'">  
          <Button col="0" text="作支付" @tap="onPayment()" class="btn btn-primary"  style="width:80;" />
          <TextField col="1" row="0" v-model="payMemo" autocorrect="false"/>
          <TextField col="2" row="0" v-model="payValue" autocorrect="false"/>
          <Button col="3" row="0" text="查记录" @tap="onWalletHistory()" class="btn btn-primary"  style="width:80;" />
          <Button col="0" row="1" text="查关系" @tap="onWalletRelations()" class="btn btn-primary"  style="width:80;" />
          <TextField col="1" row="1" v-model="qrRelation" autocorrect="false"/>
          <Button col="3" row="1" text="查挂单" @tap="onWalletOffers()" class="btn btn-primary"  style="width:80;" />
          <Button col="0" row="2" text="挂单买" @tap="onOfferBuy()" class="btn btn-primary"  style="width:80;" />
          <TextField col="1" row="2" v-model="offerSWT" autocorrect="false"/>
          <TextField col="2" row="2" v-model="offerCNY" autocorrect="false"/>
          <Button col="3" row="2" text="挂单卖" @tap="onOfferSell()" class="btn btn-primary"  style="width:80;" />
        </GridLayout>
        <GridLayout ref="listenRef" columns="80,*,*,80" rows="40" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'">
          <Button col="0" width="80" :text="!onLedger ? '监听账本' : '停止监听账本'" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'" @tap="onListenLedger()" class="btn btn-primary btn-active" />
          <Button col="3" width="80" :text="!onTransaction ? '监听交易' : '停止监听交易'" :visibility="remoteStatus && !remoteConnecting ? 'visible' : 'collapse'" @tap="onListenTransaction()" class="btn btn-primary btn-active" />
        </GridLayout>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
const dialogs = require('tns-core-modules/ui/dialogs')
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import * as platformModule from "tns-core-modules/platform";
import JingtumService from './../services';
const jingtumService = new JingtumService();
const feedbackplugin = require('nativescript-feedback')
var feedback = new feedbackplugin.Feedback()
var clipboard = require("nativescript-clipboard")
var toasts = require('nativescript-toasts')
import sideDrawer from '~/mixins/sideDrawer'
require('nativescript-nodeify')
const JingtumLib = require('jingtum-lib')
const Remote = JingtumLib.Remote
export default {
  mixins: [ sideDrawer ],
  data() {
    return {
      appVersion: '1.1.0',
      walletIndex: -1,
      serverIndex: -1,
      remote: null,
      remoteConnecting: false,
      qrLedgerTransaction: '',
      onTransaction: false,
      onLedger: false,
      payValue: 1,
      payMemo: 'memo赞助',
      qrRelation: 'trust',
      offerSWT: 1,
      offerCNY: 0.01,
    };
  },
  computed: {
    ...mapGetters({activated: 'swtcActivated', sequence: 'swtcSequence', balance: 'swtcBalance', price: 'swtcPrice', msgs: 'msgs', wallets: 'swtcWallets', wallet: 'swtcWallet', servers: 'swtcServers', server: 'swtcServer'}),
    remoteStatus: function () {
      return this.remote && this.remote.isConnected() 
    },
    pageClasses: function() {
      return {
        // add top class so we can apply styles to specific platforms
        "platform-ios": platformModule.isIOS,
        "platform-android": platformModule.isAndroid
      };
    }
  },
  methods: {
    ...mapMutations([
      "appendMsg", "setSwtcWallet", "saveSwtcWallet", "setSwtcServer", "saveSwtcServer", "setSwtcActivated","setSwtcPrice", "setSwtcSequence", "setSwtcBalance"
    ]),
    ...mapActions([]),
    callback_message (msg) {
      console.log(msg)
      this.$store.commit('appendMsg',msg)
      this.showLastLog()
    },
    toClipboard(content){
      clipboard.setText(content).then(() => { this.appendMsg(`${content}已拷贝到粘贴板`); this.showLastLogToasts()});
    },
    showLastLog() {
      this.showLastLogToasts()
    },
    showLastLogFeedback() {
      let lastMessage = this.msgs[0]
      let message = lastMessage.msg
      if (typeof(lastMessage.msg) === typeof({})) {
        message = JSON.stringify(lastMessage.msg, '', 2)
      }
      feedback.show({
        title: "输出",
        message: message,
        duration: 2000,
        onTap: function() { feedback.hide(); }
      })
    },
    showLastLogToasts() {
      let lastMessage = this.msgs[0]
      let message = lastMessage.msg
      if (typeof(lastMessage.msg) === typeof({})) {
        message = JSON.stringify(lastMessage.msg, '', 2)
      }
      toasts.show({
        text: message,
        duration: toasts.DURATION.LONG,
      })
    },
    onPayment(){
      console.log("donation")
      this.appendMsg(`测试支付赞助 ${this.payMemo}`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.pay(this.remote, this.wallet, 'jGxW97eCqxfAWvmqSgNkwc2apCejiM89bG',this.payValue,'SWT','',this.payMemo,cbErrResult)
    },
    onOfferSell(){
      console.log("manage offers")
      this.appendMsg(`操作挂单...`)
      this.showLastLog()
      let takerpays = {value: `${this.offerCNY}`, currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'}
      let takergets = {value: `${this.offerSWT}`, currency: 'SWT', issuer: ''}
      jingtumService.requestOffer(this.remote, this.wallet, 'Sell', takergets, takerpays)
    },
    onOfferBuy(){
      console.log("manage offers")
      this.appendMsg(`操作挂单...`)
      this.showLastLog()
      let takergets = {value: `${this.offerCNY}`, currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'}
      let takerpays = {value: `${this.offerSWT}`, currency: 'SWT', issuer: ''}
      jingtumService.requestOffer(this.remote, this.wallet, 'Buy', takergets, takerpays)
    },
    onOrderBook() {
      console.log("query orderbooks")
      this.appendMsg(`查询市场...`)
      this.showLastLog()
      var callbackGetPrice =  (err, result) => {
        if(err) {
          console.log(err)
          this.appendMsg(err)
        } else {
          if (typeof(result) === 'object') {
            let firstRecord = result.offers[0]
            let offers = []
            this.setSwtcPrice(Math.floor(10000 * Number(firstRecord.TakerGets.value) * 1000000 / Number(firstRecord.TakerPays)) / 10000)
            this.offerCNY = this.price
            result.offers.forEach(r => offers.push(`${Math.floor(Number(r.TakerPays) / 1000000)}SWT <-> ${Math.floor(r.TakerGets.value)}CNY`))
            this.appendMsg(offers.slice(0,10))
            console.log(offers)
          } else {
            console.log(result);
            this.appendMsg(result)
          }
        }
        this.showLastLog()
      }
      var options_swt_cny = {
          gets: { currency: 'SWT', issuer: '' },
          pays: { currency: 'CNY', issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or' }
      };
      jingtumService.requestOrderBook(this.remote,options_swt_cny,callbackGetPrice)
    },
    onListenLedger() {
      console.log("listen ledger_closed switch...")
      //let cbMsg = msg => { console.log(msg); this.appendMsg(msg); this.showLastLog() }
      //jingtumService.onLedger(this.remote, this.callback_message)
      if (this.onLedger) {
        this.remote.removeListener('ledger_closed', this.callback_message)
      } else {
        this.remote.on('ledger_closed', this.callback_message)
      }
      this.appendMsg(`更改账本接收...`)
      this.showLastLog()
      this.onLedger = !this.onLedger
    },
    onListenTransaction() {
      console.log("listen transactions switch...")
      if (this.onTransaction) {
        this.remote.removeListener('transactions', this.callback_message)
      } else {
        this.remote.on('transactions', this.callback_message)
      }
      this.appendMsg(`更改交易接收...`)
      this.showLastLog()
      this.onTransaction = !this.onTransaction
    },
    onWalletOffers() {
      console.log("query offers")
      this.appendMsg(`查询挂单...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.requestAccountOffers(this.remote, this.wallet.address, cbErrResult)
    },
    onWalletRelations() {
      console.log("query relation")
      this.appendMsg(`查询关系...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.requestAccountRelations(this.remote, this.wallet.address, this.qrRelation, cbErrResult)
    },
    onWalletTums() {
      console.log("available tums")
      this.appendMsg(`查询可用通证...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.requestAccountTums(this.remote, this.wallet.address, cbErrResult)
    },
    onWalletHistory() {
      console.log("history")
      this.appendMsg(`查询支付记录...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.requestAccountTx(this.remote, this.wallet.address, cbErrResult)
    },
    onWalletBalance() {
      console.log("update balance")
      this.appendMsg("查余额...");
      this.showLastLog()
      let callbackAccount =  (err, result) => {
        if(err) {
          console.log(err)
          this.appendMsg(err)
          if (err === 'Account not found.') {
            alert("账号未激活, 转入35个井通和0.1CNY可以体验账号相关测试")
          }
        } else {
          this.setSwtcActivated(true)
          console.log(result)
          if (typeof(result) === 'object') {
            this.appendMsg(JSON.stringify(result,'',2))
            this.setSwtcSequence(result.account_data.Sequence)
            this.setSwtcBalance(Math.floor(result.account_data.Balance / 10000) / 100)
          } else {
            this.appendMsg(result)
          }
        }
        this.showLastLog()
      }
      jingtumService.requestAccountInfo(this.remote, this.wallet.address, callbackAccount);
    },
    onQueryLedger(){
      console.log("querying ledger ...")
      this.appendMsg(`查询账本...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.queryLedger(this.remote, this.qrLedgerTransaction, true, cbErrResult)
    },
    onQueryTransaction(){
      console.log("querying transaction ...")
      this.appendMsg(`查询交易...`)
      this.showLastLog()
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.queryTransaction(this.remote,this.qrLedgerTransaction, cbErrResult)
    },
    onRemoteInfo() {
      let cbErrResult = (err, result) => {if(err) { console.log(err); this.appendMsg(err)} else {console.log(result); this.appendMsg(result)} this.showLastLog()}
      jingtumService.requestServerInfo(this.remote, cbErrResult);
    },
    onRemoteConnection() {
      console.log("switching remote connection")
      this.remoteConnecting = true
      console.log("server connection change")
      var callbackConnect =  (err, result) =>{
          this.remoteConnecting = false;
          if(err) {
            console.log(err)
            this.appendMsg(err)
          } else {
            console.log(result)
            this.appendMsg(result)
          }
          this.showLastLog()
        }
      if (this.remoteStatus) {
        jingtumService.disconnect(this.remote)
        this.remoteConnecting = false
        this.setSwtcPrice(0)
        this.setSwtcBalance(0)
        this.appendMsg('remote disconnected')
      } else {
        jingtumService.connect(this.remote,callbackConnect)
      }
      this.onLedger = false
      this.onTransaction = false
      //callbackPost()
    },
    onServerSelected() {
      console.log("server seclected");
      this.setSwtcServer(this.servers[this.serverIndex])
      this.saveSwtcServer()
      this.remote = jingtumService.newRemote(this.server)
      console.log(this.server.server)
      this.appendMsg(this.server)
      this.showLastLog()
    },
    onWalletSelected() {
      console.log("wallet seclected");
      this.setSwtcWallet(this.wallets[this.walletIndex])
      this.saveSwtcWallet()
      console.log(this.wallet.address)
      this.appendMsg(this.wallet)
      this.showLastLog()
    },
  },
  created() { 
    console.log("jingtum app created")
    this.walletIndex = this.wallets.indexOf(this.wallets.filter(w => w.address === this.wallet.address)[0])
    this.serverIndex = this.servers.indexOf(this.servers.filter(s => s.server === this.server.server)[0])
  },
  mounted() {
    console.log("jingtum app mounted")
    console.log(this.wallet.address)
    console.log(this.server.server)
    if (this.server.hasOwnProperty('server')) {
      console.log("set jingtumlib.remote")
      this.remote = jingtumService.newRemote(this.server)
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
.message {
  vertical-align: center;
  text-align: left;
  font-size: 16;
  color: #333333;
  line-height: 20%;
}
.dapp {
  text-align: left;
  font-size: 20;
}
Button {
  font-size: 12;
  height: 36;
  text-align: center;
}
</style>

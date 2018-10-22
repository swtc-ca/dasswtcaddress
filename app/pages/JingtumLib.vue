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
      <StackLayout :visibility="wallet.hasOwnProperty('address') ? 'collapse' : 'visible'">
          <ListPicker :items="wallets.map(w => w.address)" v-model="walletIndex" />
          <Button text="选择井通地址" @tap="onWalletSelected" class="btn btn-primary btn-active"/>
      </StackLayout>
      <StackLayout :visibility="wallet.hasOwnProperty('address') ? 'visible' : 'collapse'">
        <GridLayout ref="walletRef" columns="80,*,2*,90" rows="36">
          <Label col="0" text="井通地址" />
          <Label col="1" :text="sequence ? '序号' + sequence : ''" />
          <Label col="2" :text="balance ? '余额' + balance : ''" />
          <Label col="3" :text="!!price ? '价格' + price : ''" />
        </GridLayout>
        <Label :text="' 地址: ' + wallet.address" @onTap="toClipboard(wallet.address)" />
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
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [ sideDrawer ],
  data() {
    return {
      appVersion: '1.1.0',
      walletIndex: -1,
    };
  },
  computed: {
    ...mapGetters({sequence: 'swtcSequence', balance: 'swtcBalance', price: 'swtcPrice', msgs: 'msgs', wallets: 'swtcWallets', wallet: 'swtcWallet', servers: 'swtcServers', server: 'swtcServer'}),
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
      "appendMsg", "setSwtcWallet", "saveSwtcWallet", "setSwtcServer", "saveSwtcServer"
    ]),
    ...mapActions([]),
    toClipboard(content){
      clipboard.setText(content).then(() => { this.appendMsg(`${content}已拷贝到粘贴板`); this.showLastLog()});
    },
    showLastLog() {
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
  },
  mounted() {
    console.log("jingtum app mounted")
    console.log(this.wallet.address)
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

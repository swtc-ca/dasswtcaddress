<template>
  <Page class="page">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="浏览器实况">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <StackLayout ~mainContent>
      <GridLayout columns="80, 60, *" rows="*" class="item" height="60" backgroundColor="White">
        <Label text="账本高度" class="h4" col="0" row="0" />
        <label text="交易数" class="h4" col="1" row="0"/>
        <label text="账本哈希" class="h4" col="2" row="0"/>
      </GridLayout>
      <item-list
        ref="list"
        :items="ledgers"
        :pulltorefresh="false"
        :swipeactions="false"
        @watchrefresh="onWatchRefresh"
        @itemTap="onItemTap"
        @itemSelected="onItemSelected"
        @itemDeleted="onItemDeleted"
        @pulling="onPulling">
      </item-list>
    </StackLayout>
  </Page>
</template>

<script>
import BackendService from './../services'
var backendService = new BackendService()
import LedgerList from './../components/ledgerList'
var callback_on_ledger = () => {}
import sideDrawer from '~/mixins/sideDrawer'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  mixins: [ sideDrawer ],
  components: {
    'item-list': LedgerList,
  },
  data() {
    return {
      remote: null
    }
  },
  computed: {
    ...mapGetters({ledgers: 'swtcLedgers', msgs: 'msgs', server: 'swtcServer'}),
  },
  methods: {
    ...mapMutations(['appendMsg', 'addSwtcLedger']),
    onWatchRefresh() {
      console.log("received watchrefersh")
    },
    onItemTap({ item }) {
      console.log(`Tapped on ${item.address}`)
    },
    onPulling (listview) {
      listview.notifyPullToRefreshFinished()
    },
    onItemSelected (item) {
      this.$refs.list.refresh()
    },
    onItemDeleted (item) {
      this.removeWallet(item)
      this.saveWallets()
      this.$refs.list.refresh()
    }
  },
  created() {
    console.log("created")
    console.log("create local remote")
    console.log(this.server.server)
    this.remote = backendService.newRemote(this.server)
    console.log(this.remote._url)
  },
  mounted() {
    console.log("mounted")
    console.log("connect local remote")
    console.log(this.server)
    this.remote.connect((error, result) => {
      if (error) {
        console.log("connect error")
        console.log(error)
        this.appendMsg(error)
      } else {
        console.log("connected")
        console.log(result)
        this.appendMsg(result)
        // connected to the remote now, install ledger monitoring
        console.log("connected local remote")
        callback_on_ledger = msg => { console.log(msg); this.addSwtcLedger(msg); this.appendMsg(msg) }
        this.remote.on('ledger_closed', callback_on_ledger)
      }
    })
    console.log(this.msgs)
  },
  destroyed () {
    console.log("destroyed")
    if (this.remote && this.remote.isConnected()) {
      console.log("remove ledger monitoring")
      this.remote.removeListener('ledger_closed', callback_on_ledger)
      console.log("disconnect")
      this.remote.disconnect()
      console.log("disconnected")
    }
  }
};
</script>

<style scoped>
</style>

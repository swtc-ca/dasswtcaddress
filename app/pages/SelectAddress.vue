<template>
  <Page class="page">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="选择井通靓号">
      <ActionItem icon="res://ic_menu" ios.position="right"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*">
      <item-list
        ref="list"
        :items="itemList"
        leftswipetext="收纳"
        rightswipetext="淘汰"
        @watchrefresh="onWatchRefresh"
        @itemTap="onItemTap"
        @itemSelected="onItemSelected"
        @itemDeleted="onItemDeleted"
        @pulling="onPulling">
      </item-list>
    </GridLayout>
  </Page>
</template>

<script>
import BackendService from './../services'
var backendService = new BackendService()
import ItemList from './../components/itemList'

import sideDrawer from '~/mixins/sideDrawer'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  mixins: [ sideDrawer ],
  components: {
    'item-list': ItemList,
  },
  data() {
    return {
      itemList: [],
    }
  },
  computed: {
  },
  methods: {
    ...mapMutations({addWallet: 'addSwtcWallet', saveWallets: 'saveSwtcWallets'}),
    onWatchRefresh() {
      console.log("received watchrefersh")
    },
    onItemTap({ item }) {
      console.log(`Tapped on ${item.address}`)
    },
    onPulling (listview) {
      setTimeout(() => {
        this.itemList.unshift(backendService.newWallet())
        listview.notifyPullToRefreshFinished()
        listview.refresh()
      })
    },
    onItemSelected (item) {
      this.addWallet(item)
      this.saveWallets()
      this.itemList.splice(this.itemList.indexOf(item), 1)
      this.$refs.list.refresh()
    },
    onItemDeleted (item) {
      this.itemList.splice(this.itemList.indexOf(item), 1)
      this.$refs.list.refresh()
    },
  },
  created() {
    for (let i = 0; i < 20; i++) {
      this.itemList.push(backendService.newWallet())
    }
    if ( this.$store.debug ) {
      console.log("itemlist")
      console.log(this.itemList)
    }
  },
  mounted() {
    if ( this.$store.debug ) {
      console.log("destroyed")
    }
  },
  destroyed () {
    if ( this.$store.debug ) {
      console.log("destroyed")
    }
  }
};
</script>

<style scoped>
</style>

<template>
  <Page class="page">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      title="我的井通靓号">
      <ActionItem icon="res://ic_menu"
                  @tap="switchDrawer()"/>
    </ActionBar>

    <GridLayout ~mainContent columns="*" rows="*">
      <item-list
        ref="listmine"
        :items="wallets"
        :pulltorefresh="false"
        leftswipetext="保留"
        rightswipetext="舍弃"
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
    }
  },
  computed: {
    ...mapState(['wallets'])
  },
  methods: {
    ...mapMutations(['removeWallet', 'saveWallets']),
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
      this.$refs.listmine.refresh()
    },
    onItemDeleted (item) {
      this.removeWallet(item)
      this.saveWallets()
      this.$refs.listmine.refresh()
    }
  },
  created() {
    if ( TNS_ENV !== 'production' ) {
      console.log("wallets")
      console.log(this.wallets)
    }
  },
  mounted() {
    if ( TNS_ENV !== 'production' ) {
      console.log("destroyed")
    }
  },
  destroyed () {
    if ( TNS_ENV !== 'production' ) {
      console.log("destroyed")
    }
  }
};
</script>

<style scoped>
</style>

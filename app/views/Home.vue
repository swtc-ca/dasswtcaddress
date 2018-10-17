<template>
  <Page class="page">
    <ActionBar
      color="white"
      backgroundColor="#53ba82"
      class="action-bar"
      :title="isSelecting ? '选择井通靓号' : '我的井通靓号'">
      <ActionItem icon="res://ic_menu"
                  @tap="$refs.drawer.nativeView.showDrawer()"/>
    </ActionBar>
    <StackLayout>
      <RadSideDrawer ref="drawer">
        <StackLayout ~drawerContent
                     class="drawer"
                     backgroundColor="white"
                     drawerContentSize="150">
          <Image src="~/assets/images/das256.png"
                 class="sideLogo" width="100" height="100" />
          <Label text="井通靓号选" class="sideLabel sideLightGrayLabel"></Label>
          <Label text="选择靓号" class="sideLabel" @tap="onSelect"></Label>
          <Label text="我的靓号" class="sideLabel" @tap="onMine"></Label>
          <Label text="关于" class="sideLabel sideLightGrayLabel"></Label>
          <Label text="DAS数字资产" class="sideLabel"></Label>
          <Label text="SWTC基金会" class="sideLabel"></Label>
          <Label text="井通公链" class="sideLabel"></Label>
          <Label text="CA生态节点" class="sideLabel"></Label>
          <Label text="版本: 1.0.1" class="sideLabel"></Label>
        </StackLayout>
        <StackLayout ~mainContent class="page-content">
          <item-list
            ref="list"
            :isSelecting="isSelecting"
            :items="isSelecting ? itemList : wallets"
            @itemTap="onItemTap"
            @itemSelected="onItemSelected"
            @itemDeleted="onItemDeleted"
            @pulling="onPulling">
          </item-list>
        </StackLayout>
      </RadSideDrawer>
    </StackLayout>
  </Page>
</template>

<script>
import About from './About'
import BackendService from '../services'
const backendService = new BackendService()


export default {
  data() {
    return {
      itemList: [],
      wallets: [],
      itemsPulled: 0,
      isSelecting: true,
    }
  },
  methods: {
    onItemTap({ item }) {
      console.log(`Tapped on ${item.address}`)
    },
    onPulling (listview) {
      this.itemsPulled++
      setTimeout(() => {
        this.itemList.unshift(backendService.newWallet())
        listview.notifyPullToRefreshFinished()
        listview.refresh()
      })
    },
    onItemSelected (item) {
      if (this.isSelecting) {
        this.wallets.unshift(item)
        backendService.wallets = this.wallets
        this.itemList.splice(this.itemList.indexOf(item), 1)
      }
      this.$refs.list.refresh()
    },
    onItemDeleted (item) {
      if (this.isSelecting) {
        this.itemList.splice(this.itemList.indexOf(item), 1)
      } else {
        this.wallets.splice(this.wallets.indexOf(item),1)
        backendService.wallets = this.wallets
      } 
      this.$refs.list.refresh()
    },
    onSelect () {
      this.isSelecting = true
      this.itemList.reverse()
      for (let i = this.itemList.length; i < 10 + Math.ceil(Math.random() * 10); i++) {
        this.itemList.push(backendService.newWallet())
      }
      this.$refs.drawer.nativeView.closeDrawer()
      console.log("refresh on select")
      this.$refs.list.refresh()
      //setTimeout(() => { this.$refs.list.refresh(); console.log("refresh on select"); }, 200 )
    },
    onMine () {
      this.isSelecting = false
      this.wallets.reverse()
      //backendService.wallets.forEach(element => this.wallets.push(element))
      this.$refs.drawer.nativeView.closeDrawer()
      //setTimeout(() => { this.$refs.list.refresh(); console.log("refresh on mine"); }, 500 )
      this.$refs.list.refresh()
      console.log("refresh on mine")
    }
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.itemList.push(backendService.newWallet())
    }
    backendService.wallets.forEach(element => this.wallets.push(element))
  },
  mounted() {
      this.itemList.push(backendService.newWallet())
  }
};
</script>

<style scoped>
</style>

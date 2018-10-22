<template lang="html">
  <ScrollView>
    <StackLayout width="100%">
      <Label class="drawer-header" text="井通首科" @tap="closeDrawer()"/>

      <Label text="井通地址" class="sideLabel sideLightGrayLabel"></Label>
      <Label
        v-for="(page, i) in pages"
        @tap="goToPage(page.component, page.navigateoption)"
        class="sideLabel"
        :text="page.name"
        :key="i"
      />
      <Label text="关于" class="drawer-item sideLightGrayLabel"></Label>
      <Label text="DAS数字资产" class="drawer-item"></Label>
      <Label text="SWTC基金会" class="drawer-item"></Label>
      <Label text="井通公链" class="drawer-item"></Label>
      <Label text="CA生态节点" class="drawer-item"></Label>
      <Label text="版本" class="drawer-item sideLightGrayLabel"></Label>
      <Label text="v1.1.0" class="drawer-item"></Label>

    </StackLayout>
  </ScrollView>
</template>

<script>
import sideDrawer from '~/mixins/sideDrawer'
export default {
  mixins: [sideDrawer],
  data () {
    return {
      // define our pages, making sure the component matches that defined in /app/router/index.js
      pages: [
        { name: '我的靓号', component: this.$routes.MineAddress, navigateoption: {clearHistory: true}, },
        { name: '挑选靓号', component: this.$routes.SelectAddress, navigateoption: { clearHistory: true }, },
        { name: '井通lib', component: this.$routes.JingtumLib, navigateoption: { clearHistory: true }, },
        { name: '浏览器', component: this.$routes.Explorer, navigateoption: { clearHistory: true }, },
      ]
    }
  },
  methods: {
    goToPage (pageComponent, navigateoption) {
      // use the manual navigation method
      this.$navigateTo(pageComponent, navigateoption)
      // and we probably want to close the drawer when changing pages
      this.closeDrawer()
    }
  }
}
</script>

<style lang="css">
</style>
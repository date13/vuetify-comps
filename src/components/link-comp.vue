<template>
  <div style="position: relative">
    <v-menu :open-on-click="openClick" v-model="showMenu" z-index="300">
      <template v-slot:activator="{ on }">
        <template v-if="linkStyle==='btn'">
          <v-btn  color="primary"  @click="open" class="lang-btn" v-on="on">选择</v-btn>
        </template>
        <template v-else >
          <div v-on="on">
            <v-text-field class="input-text my-2" @click="showMenu = true" hide-details placeholder="请选择链接" v-model="prop.name"></v-text-field>
            <v-text-field v-show="prop.module==='custom'" class="input-text my-2"  hide-details placeholder="请输入链接" v-model="prop.href"></v-text-field>
          </div>
        </template>
      </template>
      <v-list>
        <v-list-item
            v-for="(link,key) in linkMap" :key="key"
            @click="choiceLink(key,link)"
        >
          <v-list-item-title class="body-2">{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import {Msg} from '@/utils/tools';
import {LinkCompType, LinkType} from "@/model/const";

export default {
  name: 'link-comp',
  props: ['prop', 'excludeType', 'linkStyle', 'type', 'linkCompType', 'params',"shopId"],
  data() {
    return {
      linkMap: {},
      // shopId: '',
      openClick: false,
      isMulti: false,
      showMenu: false,
      checkIds: [],
    }
  },
  created() {
    this.initPdtLink();
    this.initPdtGroupLink();
    this.initPdtCategoryLink();
    this.initPageLink();
    this.initCustomLink();
  },
  components: {
    // [GoodsDialog.name]:
  },
  mounted() {

  },
  methods: {
    open() {
      // console.log("click");
      // if(!this.shopId){
      //   Msg.warn("请选择专区！")
      //   return false;
      // }
      // localStorage.setItem("shopId",this.shopId)
      this.showMenu = true
    },
    getPdtSelect(data) {
      this.prop.name = `商品 | ${data.name}`;
      this.prop.objectId = data.id;
    },
    getPdtMultiSelect(datas) {
      console.log(datas);
    },
    initPdtLink() {
      console.log(this.excludeType);
      if (this.excludeType && this.excludeType.has(LinkType.pdt)) return;
      this.linkMap[LinkType.pdt] =
          {
            title: '商品',
            bind: (link) => {
              Msg.alert('商品窗口打开');
              // this.$refs.linkDialog.openPdtDialog(this.params);
              // this.$refs.linkDialog.curItem = this.prop;
              if (this.linkCompType !== LinkCompType.menu) {
                // Tools.changeDecorateStatus(true);
              }
            }
          };
    },
    initPageLink() {
      if (this.excludeType && this.excludeType.has(LinkType.page)) return;
      this.linkMap[LinkType.page] =
          {
            title: '微页面',
            bind: (link, type) => {
              Msg.alert('微页面窗口打开');
              if (this.linkCompType !== LinkCompType.menu) {
                // Tools.changeDecorateStatus(true);
              }
            }
          };
    },
    initPdtCategoryLink(){
      if (this.excludeType && this.excludeType.has(LinkType.pdtCategory)) return;
      this.linkMap[LinkType.pdtCategory] =
          {
            title: '商品类别',
            bind: (link, type) => {
              Msg.alert('商品类别窗口打开');
              if (this.linkCompType !== LinkCompType.menu) {
                // Tools.changeDecorateStatus(true);
              }
            }
          };
    },
    initPdtGroupLink() {
      if (this.excludeType && this.excludeType.has(LinkType.pdtGroup)) return;
      this.linkMap[LinkType.pdtGroup] =
          {
            title: '商品分组',
            bind: (link, type) => {
              Msg.alert('商品分组窗口打开');
              if (this.linkCompType !== LinkCompType.menu) {
                // Tools.changeDecorateStatus(true);
              }
            }
          };
    },
    initCustomLink() {
      if (this.excludeType && this.excludeType.has(LinkType.custom)) return;
      this.linkMap[LinkType.custom] =
          {
            title: '自定义链接',
            bind: (link, type) => {
              this.prop.module = type;
              this.prop.objectId = '';
              this.prop.href = this.prop.image1 ? this.prop.image1 :  'http://';
              this.prop.name = link.title;
              // Tools.changeDecorateStatus(true);
            }
          };
    },
    choiceLink(type, link) {
      link.bind(link, type);
    }
  }
}
</script>
<style scoped lang="less">
</style>

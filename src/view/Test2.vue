<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-btn color="primary" @click="alert" class="mr-2">Alert</v-btn>
          <v-btn color="second" @click="confirm">Confirm</v-btn>
        </v-col>
        <v-col>
          <label>选择链接1</label>
          <LinkComp :prop="prop"></LinkComp>
          <p></p>
          <label>选择链接2</label>
          <LinkComp :prop="prop" linkStyle="btn" :excludeType="excludeType"></LinkComp>
        </v-col>
      </v-row>
    </v-container>

  </v-main>
</template>
<script>
import {Msg} from "@/utils/tools";
import LinkComp from '../components/link-comp.vue';
import {TitleLink} from "@/model/link";
import {LinkType} from "@/model/const";

export default {
  data() {
    return {
      prop: new TitleLink(),
      excludeType: new Set().add(LinkType.custom).add(LinkType.pdtGroup)
    }
  },
  mixins: [],
  directives: {},
  components: {
    LinkComp
  },
  mounted() {
  },
  methods: {
    alert() {
      Msg.alert("this is alert dialog")
    },
    confirm() {
      Msg.confirm('are you sure?', () => {
        Msg.alert('sure click');
      }, () => {
        Msg.alert('cancel click')
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

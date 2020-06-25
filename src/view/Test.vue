<template>
    <treeTransfer width="800px" height="600px" :from_data.sync="fromData" :to_data.sync="toData"
                  :open-all="true"/>
</template>
<script>
  import treeTransfer from '../components/tree-transfer';

  export default {
    data() {
      return {
        toData: [],
        fromData: [{
          id: 1,
          pid: null,
          name: '湖北省',
          children: [
            {
              id: 11, name: '武汉市', pid: 1,
              children: [
                {id: 111, pid: 11, name: '武昌区'},
                {id: 112, pid: 11, name: '洪山区'},
                {id: 113, pid: 11, name: '桥口区'},
              ],
            },
            {
              id: 12, name: '黄石市', pid: 1,
              children: [
                {id: 121, pid: 12, name: '东区'},
                {id: 122, pid: 12, name: '南区'},
                {id: 123, pid: 12, name: '北区'},
              ],
            },
          ],
        },
          {
            id: 2,
            pid: null,
            name: '浙江省',
            children: [
              {
                id: 21, name: '杭州市', pid: 2,
                children: [
                  {id: 211, pid: 21, name: '拱墅区'},
                  {id: 212, pid: 21, name: '西湖区'},
                  {id: 213, pid: 21, name: '萧山区'},
                ],
              }
            ],
          }],
      }
    },
    mixins: [],
    directives: {},
    components: {
      treeTransfer
    },
    mounted() {
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
</style>

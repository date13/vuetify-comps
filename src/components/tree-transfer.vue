<template>
  <div class="transfer" :style="{ width, height }">
    <div class="transfer-left">
      <h3 class="transfer-title">
        选择区
        <v-checkbox
            v-model="from_check_all"
            hide-details
            label="全选"
            @change="fromAllBoxChange"
            class="d-inline-block float-right mt-1"
        />
        <!--<v-btn @click="toggle" class="pull-right">button</v-btn>-->
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <v-treeview
            ref="from-tree"
            v-model="from_sel"
            :open="from_sel_open"
            :items="from_data"
            selection-type="leaf"
            selectable
            :open-all="openAll"
            dense
            return-object
        />
      </div>
    </div>
    <div class="transfer-center">
      <template v-if="button_text">
        <p class="transfer-center-item">
          <v-btn color="primary" @click="addToAims" :disabled="from_disabled" label="添加">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </p>
        <p class="transfer-center-item">
          <v-btn
              color="primary"
              @click="removeToSource"
              :disabled="to_disabled"
              label="移除"
          >
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </p>
      </template>
      <template v-else>
        <p class="transfer-center-item">
          <v-btn color="primary" @click="addToAims" circle :disabled="from_disabled">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </p>
        <p class="transfer-center-item">
          <v-btn color="primary" @click="removeToSource" :disabled="to_disabled" circle>
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </p>
      </template>
    </div>
    <div class="transfer-right">
      <h3 class="transfer-title">
        已选区
        <v-checkbox
            v-model="to_check_all"
            hide-details
            label="全选"
            @change="toAllBoxChange"
            class="d-inline-block float-right mt-1"
        />
      </h3>
      <!-- 内容区 -->
      <div class="transfer-main">
        <v-treeview
            ref="to-tree"
            v-model="to_sel"
            :open="to_sel_open"
            :items="to_data"
            selection-type="leaf"
            :open-all="openAll"
            selectable
            dense
            return-object
        />
      </div>
    </div>
  </div>
</template>

<script>
  import {arrayToTree, flattenDeep} from "../utils/array";
  import _ from "lodash";

  export default {
    name: "treeTransfer",
    props: {
      width: {
        type: String,
        default: "640px"
      },
      height: {
        type: String,
        default: "320px"
      },
      // 标题
      title: {
        type: Array,
        default: () => ["源列表", "目标列表"]
      },
      // 穿梭按钮名字
      button_text: Array,
      from_data: {
        type: Array,
        default: () => []
      },
      // 选中数据
      to_data: {
        type: Array,
        default: () => []
      },
      // 是否展开所有节点
      openAll: {
        type: Boolean,
        default: true
      },
      // 自定义 pid参数名
      pid: {
        type: String,
        default: "pid"
      }
    },
    data() {
      return {
        flat_from_data: [], //扁平化后的from_data
        flat_to_data: [], //扁平化后的to_data
        to_sel_open: [], //打开的节点数组
        from_sel_open: [],
        from_check_all: false, // 源数据是否全选
        to_check_all: false, // 目标数据是否全选
        from_expanded_keys: [], // 源数据展开节点
        to_expanded_keys: [], // 目标数据展开节点
        from_disabled: true, // 添加按钮是否禁用
        to_disabled: true, // 移除按钮是否禁用
        from_sel: [], // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
        to_sel: [], // 目标数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态,
        from_sum: 0,
        to_sum: 0
      };
    },
    computed: {},
    watch: {
      // 左侧 状态监测
      from_sel(val) {
        if (val.length > 0) {
          // 穿梭按钮是否禁用
          this.from_disabled = false;
          if (val.length === this.from_sum) {
            this.from_check_all = true;
          } else {
            this.from_check_all = false;
          }
        } else {
          this.from_disabled = true;
          this.from_check_all = false;
        }
      },
      // 右侧 状态监测
      to_sel(val) {
        if (val.length > 0) {
          // 穿梭按钮是否禁用
          this.to_disabled = false;
          // 总全选是否开启 - 根据选中节点中为根节点的数量是否和源数据长度相等
          if (val.length === this.to_sum) {
            this.to_check_all = true;
          } else {
            this.to_check_all = false;
          }
        } else {
          this.to_disabled = true;
          this.to_check_all = false;
        }
      }
    },
    created() {
      this.flatFromToData();
    },
    methods: {
      toggle() {
        this.from_check_all = !this.from_check_all;
      },
     flatFromToData() {
        this.shakeTree(this.from_data);
        this.shakeTree(this.to_data);
        this.flat_from_data = _.cloneDeep(flattenDeep(this.from_data));
        this.flat_from_data.forEach(item => {
          item.children = [];
        });
        
        this.flat_to_data = _.cloneDeep(flattenDeep(this.to_data));
        this.flat_to_data.forEach(item => {
          item.children = [];
        });
        this.from_sum = this.addNodeWithDeep(
          this.from_data,
          [],
          2,
          1,
          true
        );
        
        this.to_sum = this.addNodeWithDeep(this.to_data, [], 2, 1, true);
        this.$forceUpdate();
        
      
      },
      addNodeWithDeep(loopArr, arr, deep, curDeep = 1, onlyCalc = false) {
        let sum = 0;
        if (loopArr) {
          loopArr.forEach(item => {
            if (curDeep === deep) {
              if (!onlyCalc) {
                arr.push(...item.children);
              }
              sum += item.children ? item.children.length : 0;
            } else {
              sum += this.addNodeWithDeep(
                item.children,
                arr,
                deep,
                ++curDeep,
                onlyCalc
              );
              curDeep = 1;
            }
          });
        }
        return sum;
      },
      // 源数据 总全选checkbox
      fromAllBoxChange(val) {
        if (val) {
          let arr = [];
          this.addNodeWithDeep(this.from_data, arr, 1);
          this.from_sel = arr;
        } else {
          this.from_sel = [];
        }
      },
      toAllBoxChange(val) {
        if (val) {
          let arr = [];
          this.addNodeWithDeep(this.to_data, arr, 1);
          this.to_sel = arr;
        } else {
          this.to_sel = [];
        }
      },
      move(key, fromKey, toKey) {
        let selKey = `${key}_sel`,
          flatSourceKey = `flat_${fromKey}_data`,
          flatTargetKey = `flat_${toKey}_data`,
          sourceSelOpenKey = `${fromKey}_sel_open`,
          targetSelOpenKey = `${toKey}_sel_open`,
          sourceData = `${fromKey}_data`,
          targetData = `${toKey}_data`;
        let flatData = [...this[selKey]];
        //提高效率只查找没有pid
        let pidSet = new Set();

        //1.把选择的leaf节点找到所有的父节点
        this[selKey].forEach(item => {
          this.findParentToSelData(
            flatData,
            flatSourceKey,
            item.pid,
            pidSet
          );
        });
        //2.找到目标中还没有的节点，合并过去
        flatData.forEach(item => {
          if (
            this[flatTargetKey].findIndex(to => {
              return to.id === item.id;
            }) === -1
          ) {
            this[flatTargetKey].push(item);
          }
        });
        //3.把添加过去的从flat_from_data去除
        _.remove(this[flatSourceKey], item => {
          return (
            this[selKey].findIndex(itemSel => {
              return itemSel.id === item.id;
            }) !== -1
          );
        });

        //4.摇树处理把空的children去掉
        // console.log(this[flatSourceKey]);
        // let source = arrayToTree(this[flatSourceKey]);
        let source = arrayToTree(this[flatSourceKey], {parentId: 'pid', dataField: null});
        // console.log(source);
        this.shakeTree(source, 2);

        //5.重建数据
        this.addOpenNode(targetSelOpenKey, flatTargetKey); //添加open的id
        this.addOpenNode(sourceSelOpenKey, flatSourceKey); //添加open的id

        this.$emit(`update:${sourceData}`, source);
        this.$emit(
          `update:${targetData}`,
          arrayToTree(this[flatTargetKey], {parentId: 'pid', dataField: null})
        );
        this.$nextTick(() => {
          //6.清除数据
          this[selKey] = [];
          //重新渲染
          // this.$refs[`${toKey}-tree`].updateAll(false);
          // this.$refs[`${fromKey}-tree`].updateAll(false);
          //重建flat source 和target数组，这里非常重要，不然第二次会出错
          this.flatFromToData();
          this.$forceUpdate();
        });

      },
      addOpenNode(openKey, flatKey) {
        this[openKey] = [];
        this[flatKey].forEach(item => {
          this[openKey].push(item.id);
        });
      },
      // 添加按钮
      addToAims() {
        // this.$set(this, 'from_check_all', false);
        // this.from_check_all = !this.from_check_all;
        this.move("from", "from", "to");
        this.from_check_all = false;
      },
      // 移除按钮
      removeToSource() {
        this.move("to", "to", "from");
        this.to_check_all = false;
        // this.fromAllBoxChange(false);
      },
      findParentToSelData(flatData, flatKey, pid, pidSet) {
        if (pid !== 0 && !pidSet.has(pid)) {
          let parent = this[flatKey].find(item => {
            return pid === item.id;
          });
          if (parent) {
            parent = Object.assign({}, parent);
            delete parent.children;
            flatData.push(parent);
            pidSet.add(parent.id);
            this.findParentToSelData(
              flatData,
              flatKey,
              parent.pid,
              pidSet
            );
          }
        }
      },
      shakeTree(source, deep) {
        //这里代码可以改进,先暂时这样
        source.forEach(item => { 
          JSON.parse(JSON.stringify(item));
          this.removeNode(item.children);
        });
        JSON.parse(JSON.stringify(source))
        this.removeNode(source);
        
        /*source.forEach(item => {
      if (deep > 0) {
        this.shakeTree(item.children, --deep);
        this.removeNode(item.children);
      }
    });*/
      },
      removeNode(arr) {
        _.remove(arr, item => {
          // 这三个为二级区域，且没有三级区域内容 分别为澳门半岛、离岛、东沙群岛
           if (!["820200", "820100", "442101"].includes(item.id)) {
              return item.children && item.children.length === 0;
           }
        });
      }
    }
  };
</script>

<style scoped lang="less">
  ul,
  ol {
    list-style: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  th,
  caption {
    text-align: left;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .transfer {
    position: relative;
    overflow: hidden;
    margin: 16px auto;
  }

  .transfer-left {
    position: absolute;
    top: 0;
    left: 0;
  }

  .transfer-right {
    position: absolute;
    top: 0;
    right: 0;
  }

  .transfer-right-item {
    height: calc((100% - 41px) / 2);
  }

  .transfer-right-small {
    height: 41px;
  }

  .transfer-right-only {
    height: 100%;
  }

  .transfer-main {
    padding: 10px;
    height: calc(100% - 41px);
    box-sizing: border-box;
    overflow: auto;
  }

  .transfer-left,
  .transfer-right {
    border: 1px solid #ebeef5;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }

  .transfer-center {
    position: absolute;
    top: 50%;
    left: 40%;
    width: 20%;
    transform: translateY(-50%);
    text-align: center;
  }

  .transfer-center-item {
    padding: 10px;
    overflow: hidden;
  }

  .address-list-center {
    height: 100%;
  }

  .address-list-center > .transfer-center-item {
    height: 50%;
    padding: 70px 10px 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .address-list-center > .address-only-item {
    height: 100%;
    position: relative;
  }

  .address-only-item > .address-first-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .transfer-title {
    border-bottom: 1px solid #ebeef5;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    background-color: #f5f7fa;
  }

  .transfer-title .el-checkbox {
    margin-right: 10px;
  }

  .filter-tree {
    margin-bottom: 10px;
  }

  .address-list-ul {
    padding-bottom: 20px;
  }

  .address-list-li {
    position: relative;
    padding: 4px 24px 4px 4px;
    border-radius: 3px;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }

  .address-list-li:hover {
    background-color: #f5f7fa;
  }

  .address-list-li:hover .address-list-del {
    display: block;
  }

  .address-list-del {
    display: none;
    position: absolute;
    top: 50%;
    right: 2px;
    margin-top: -10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    text-align: center;
    background-color: #fef0f0;
    color: #f56c6c;
    cursor: pointer;
  }

  .u-clear {
    float: right;
    color: #67c23a;
    font-size: 14px;
    cursor: pointer;
  }

  .move_up_img {
    float: right;
    margin-top: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .move_down_img {
    transform: rotate(180deg);
  }
</style>

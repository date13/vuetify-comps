<template>
  <v-app id="main" class="pa-0 ma-0 v-application">
    <AlertDialog/>
    <ConfirmDialog/>
    <router-view/>
  </v-app>
</template>

<script>
import AlertDialog from './components/AlertDialog'
import ConfirmDialog from './components/ConfirmDialog'

export default {
  name: 'App',
  /*provide() {
    return {
      reload: this.reload,
    }
  },*/
  data() {
    return {
      // isRouterAlive: true,
      loading: false
    }
  },
  components: {
    AlertDialog,
    ConfirmDialog
  },
  methods: {},
  created() {
  },
  beforeDestroy() {
  },
  mounted() {
  }
}
</script>
<style lang="less" scoped>
</style>

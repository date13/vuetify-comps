<template>
  <v-app id="main" class="pa-0 ma-0 v-application">
    <router-view/>
  </v-app>
</template>

<script>
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
    },
    methods: {
    },
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

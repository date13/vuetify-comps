<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="300"
    >
      <v-card>
        <v-card-title
            class="body-2 lighten-2"
            primary-title
        >
          <!-- {{msg}} -->
          <span v-html="msg"></span>
        </v-card-title>

        <v-card-actions>
          <v-spacer/>
          <v-btn
              color="primary"
              small
              elevation="0"
              @click="close"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import {Events} from '@/utils/events';
  import {EventType} from "@/model/const";

  export default {
    name: 'AlertDialog',
    data: () => ({
      dialog: false,
      msg: '',
      func: () => {
      }
    }),
    beforeDestroy(){
      Events.$off(EventType.alert);
    },
    mounted() {
      Events.$on(EventType.alert, (opt) => {
        Object.assign(this, opt);
      })
    },
    methods: {
      close() {
        if (this.func) {
          this.func();
        }
        this.dialog = false;
      }
    }
  }
</script>

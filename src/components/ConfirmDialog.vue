<template>
    <v-dialog
        v-model="dialog"
        width="300"
        max-width="500"
        :persistent="persistent"
    >
      <v-card>
        <v-card-title
            class="body-2 lighten-2"
            primary-title
        >
          {{msg}}
        </v-card-title>

        <v-card-actions>
          <v-spacer/>
          <v-btn
              color="primary"
              elevation="0"
              small
              @click="sure"
              class="mr-2"
          >
            确定
          </v-btn>
          <v-btn
              small
              @click="cancel"
              elevation="0"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import {Events} from '@/utils/events';
  import {EventType} from "@/model/const";

  export default {
    name: 'ConfirmDialog',
    data: () => ({
      dialog: false,
      msg: '',
      sureFunc: () => {
      },
      cancelFunc: () => {
      },
      persistent:false
    }),
    beforeDestroy(){
      Events.$off(EventType.confirm);
    },
    mounted() {
      Events.$on(EventType.confirm, (opt) => {
        Object.assign(this, opt);
      })
    },
    methods: {
      cancel() {
        if (this.cancelFunc) {
          this.cancelFunc();
        }
        this.dialog = false;
      },
      sure() {
        if (this.sureFunc) {
          this.sureFunc();
        }
        this.dialog = false;
      }
    }
  }
</script>

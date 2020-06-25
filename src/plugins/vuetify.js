import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework';
import themes from './theme'
import zhHans from 'vuetify/lib/locale/zh-Hans'

Vue.use(Vuetify);
export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: themes,
  lang: {
    locales: {'zh-Hans': zhHans},
    current: 'zh-Hans'
  }
})

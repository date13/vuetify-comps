// src/theme.js
// import colors from 'vuetify/es5/util/colors'
import colors from 'vuetify/lib/util/colors'

export default {
  themes: {
    light: {
      primary: '#191f22',
      success: '#2f3949',
      grey: '#f2f4f6',
      secondary: '#AFC0CD',
      accent: colors.shades.black,
      error: colors.red.accent3,
      lightgrey: '#c9d1da',
      task:'#21CEA1',
      'label-title': {
        base: '#73859a',
      },
    }
  },
  options: {
    minifyTheme: function (css) {
      return process.env.NODE_ENV === 'production'
        ? css.replace(/[\r\n|\r|\n]/g, '')
        : css
    }
  }
}

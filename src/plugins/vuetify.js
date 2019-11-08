import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    dark:
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    themes: {
      light: {
        primary: { base: colors.white },
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3
      },
      dark: {
        primary: { base: colors.grey.darken1 },
        secondary: colors.white
      }
    }
  }
});

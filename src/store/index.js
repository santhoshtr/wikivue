import Vue from "vue";
import Vuex from "vuex";
import article from "./modules/article";
import app from "./modules/app";
import user from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    article,
    user
  }
});

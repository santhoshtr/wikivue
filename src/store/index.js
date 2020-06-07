import Vue from "vue";
import Vuex from "vuex";
import wikipedia from "./modules/wikipedia";
import app from "./modules/app";
import user from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    wikipedia,
    user
  }
});

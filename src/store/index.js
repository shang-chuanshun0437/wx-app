import Vue from "vue";
import Vuex from "vuex";
import vip from "./modules/vip";

import getters from "./getters";
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
      vip
    },
    getters
});

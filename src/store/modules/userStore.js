/*
 * Author: 17030360
 * Email:wdnybbz@163.com
 */
import * as types from "../mutation-types";

const getters = {
  storeName: state => state.storeName,
};

const state = {
  storeName: 0,
};

const actions = {

    list({ commit }, param) {
        return new Promise((resolve, reject) => {
            commit(types.STORE_NAME, param);
        });
    },
};

const mutations = {
    [types.STORE_NAME](state, param) {
        state.storeName = param.storeName;
    },
};

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
};

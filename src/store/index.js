import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    timeEntries: []
  },
  mutations: {
    setTimeEntries(state, payload) {
      state.timeEntries = payload;
    },
  },
  actions: {},
  modules: {}
})
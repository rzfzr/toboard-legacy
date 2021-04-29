import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [{
      Title: "Exercise",
      id: 161873998,
      sum: 0
    }],
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
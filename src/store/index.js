import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projects: [],
    timeEntries: [],
    projectGoals: [{
      name: "Exercise",
      min: 3
    }],
  },
  mutations: {
    setTimeEntries(state, payload) {
      state.timeEntries = payload;
    },
    addProject(state, payload) {
      state.projects.push(payload);
    },
  },
  actions: {},
  modules: {}
})
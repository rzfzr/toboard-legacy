import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    projects: [],
    timeEntries: [],
    runningEntry: {},
    goals: [{
      project: "Exercise",
      min: (2 * 60 * 60)
    }, {
      project: "ClicNet",
      min: (40 * 60 * 60)
    }, {
      project: "Masters",
      min: (10 * 60 * 60)
    }, {
      project: "Personal",
      description: "Reading",
      min: (2 * 60 * 60)
    }, {
      project: "ClicNet",
      description: "AThingADay",
      min: (1 * 60 * 60)
    }],
  },
  mutations: {
    setTimeEntries(state, payload) {
      state.timeEntries = payload;
    },
    addProject(state, payload) {
      state.projects.push(payload);
    },
    addTimeEntry(state, payload) {
      state.timeEntries.push(payload);
    },
    setRunningEntry(state, payload) {
      state.runningEntry = payload;
    },
  },
  actions: {},
  modules: {}
})
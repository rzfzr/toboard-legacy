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
      min: (2 * 60 * 60),
      isRunning: false,
    }, {
      project: "ClicNet",
      min: (60 * 60 * 60),
      isRunning: false,
    }, {
      project: "Masters",
      min: (10 * 60 * 60),
      isRunning: false,
    }, {
      project: "Personal",
      description: "Reading",
      min: (2 * 60 * 60),
      isRunning: false,
    }, {
      project: "ClicNet",
      description: "AThingADay",
      min: (3 * 60 * 60),
      isRunning: false,
    }, {
      project: "ClicNet",
      pid: 158359448,
      description: "toboard",
      min: (20 * 60 * 60),
      isRunning: false,
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
      let goals = state.goals
      goals[goals.findIndex(x => x.description == payload.description && x.pid == payload.pid)].isRunning = true
      console.log('new list', goals, 'i ', goals.findIndex(x => x.description == payload.description && x.pid == payload.pid))
      state.goals = goals
    },

    setGoals(state, payload) {
      state.goals = payload
    }
  },
  actions: {},
  modules: {}
})
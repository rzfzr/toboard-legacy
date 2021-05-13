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
        pid: 161873998,
        min: (2 * 60 * 60),
        isRunning: false,
      },
      {
        project: "Masters",
        pid: 159827561,
        min: (10 * 60 * 60),
        isRunning: false,
      },
      {
        project: "Personal",
        pid: 160141098,
        description: "Reading",
        min: (2 * 60 * 60),
        isRunning: false,
      },
      {
        project: "ClicNet",
        pid: 158359448,
        min: (80 * 60 * 60),
        isRunning: false,
      },
      {
        project: "ClicNet",
        pid: 158359448,
        description: "AThingADay",
        min: (3 * 60 * 60),
        isRunning: false,
      },
      {
        project: "ClicNet",
        pid: 158359448,
        description: "toboard",
        min: (5 * 60 * 60),
        isRunning: false,
      },
    ],
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
      state.goals = state.goals.map(g => {
        g.isRunning = false
        return g
      })
      state.runningEntry = payload;
      let goals = state.goals
      if (!payload) return
      let fullMatchIndex = goals.findIndex(x => x.description == payload.description && x.pid == payload.pid)
      let projMatchIndex = goals.findIndex(x => !x.description && x.pid == payload.pid)
      if (fullMatchIndex != -1)
        goals[fullMatchIndex].isRunning = true
      if (projMatchIndex != -1)
        goals[projMatchIndex].isRunning = true
      state.goals = goals
    },
    setGoals(state, payload) {
      state.goals = payload
    }
  },
  actions: {},
  modules: {},
  getters: {
    // projects: state => {
    //   return state.projects;
    // }
  }
})
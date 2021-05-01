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
      },
      {
        project: "Masters",
        min: (10 * 60 * 60),
        isRunning: false,
      },
      {
        project: "Personal",
        description: "Reading",
        min: (2 * 60 * 60),
        isRunning: false,
      },
      {
        project: "ClicNet",
        pid: 158359448,
        min: (60 * 60 * 60),
        isRunning: false,
      },
      {
        project: "ClicNet",
        pid: 158359448,
        description: "AThingADay",
        min: (10 * 60 * 60),
        isRunning: false,
      },
      {
        project: "ClicNet",
        pid: 158359448,
        description: "toboard",
        min: (20 * 60 * 60),
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
      // console.log('full', fullMatchIndex, projMatchIndex);
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
  modules: {}
})
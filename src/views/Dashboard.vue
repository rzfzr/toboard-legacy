<template>
  <div>
    <my-progress />
    <goal
      v-for="goal in this.goals"
      :key="goal.project + goal.description"
      v-bind:goal="goal"
    />
    <div
      style="margin: auto; width: 20%"
      v-for="project in this.$store.state.projects"
      :key="project.id"
    >
      {{ project.name }} {{ getTime(project.sum) }}
    </div>
  </div>
</template>
<script>
import Goal from "../components/Goal.vue";
import MyProgress from "../components/Progress.vue";
import datesMixin from "../mixins/dates";
import togglMixin from "../mixins/toggl";

export default {
  name: "Dashboard",
  mixins: [datesMixin, togglMixin],
  components: {
    Goal,
    MyProgress,
  },
  data() {
    return {
      projects: [],
      goals: [],
    };
  },
  created() {
    this.updateTimeEntries();
  },
  methods: {
    getSumEntries(description) {
      let goalEntries = [];
      let goalSum = 0;
      this.$store.state.timeEntries.forEach((entry) => {
        if (entry.description == description && entry.duration > 0) {
          goalEntries.push(entry);
          goalSum += entry.duration;
        }
      });
      return goalSum;
    },
    setProjects() {
      this.projects = [];
      this.$store.state.projects.forEach((proj) => {
        let display = proj;
        display.sum = 0;
        this.$store.state.timeEntries.forEach((entry) => {
          if (entry.pid == proj.id) {
            if (entry.duration > 0) display.sum += entry.duration;
          }
        });
        this.projects.push(display);
      });
    },
    setGoals() {
      this.goals = [];
      this.$store.state.goals.forEach((goal) => {
        let goalProj = this.$store.state.projects.find(
          (x) => x.name == goal.project
        );
        if (goalProj) {
          let display = goal;

          display.hex_color = goalProj.hex_color;
          display.pid = goalProj.id;
          // display.isRunning =
          //   goalProj.name == this.$store.state.runningEntry.project;
          display.value = goal.description
            ? this.getSumEntries(goal.description)
            : goalProj.sum;
          this.goals.push(display);
        }
      });
      if (this.goals.length == this.$store.state.goals.length)
        this.$store.commit("setGoals", this.goals);
    },
    updateTimeEntries() {
      if (this.$store.state.timeEntries.length == 0) {
        console.log("getting timeEntries");
        var today = new Date();
        this.$toggl.getTimeEntries(
          this.getPreviousMonday(),
          today.toISOString(),
          (err, timeEntries) => {
            if (err) {
              console.log("error: ", err);
            } else {
              this.$store.commit("setTimeEntries", timeEntries);

              console.log(
                "running",
                this.$store.state.timeEntries.find((x) => x.duration < 0)
              );
              this.$store.commit(
                "setRunningEntry",
                this.$store.state.timeEntries.find((x) => x.duration < 0)
              );
              this.updateProjects();
            }
          }
        );
      } else {
        console.log("not getting timeEntries");
        this.updateProjects();

        console.log(
          "running",
          this.$store.state.timeEntries.find((x) => x.duration < 0)
        );
        this.$store.commit(
          "setRunningEntry",
          this.$store.state.timeEntries.find((x) => x.duration < 0)
        );
      }
    },
    updateProjects() {
      if (
        this.$store.state.projects.length == 0 &&
        this.$store.state.timeEntries.length != 0
      ) {
        console.log("getting projects");
        let uniqueProjects = [
          ...new Set(this.$store.state.timeEntries.map((item) => item.pid)),
        ];
        uniqueProjects.forEach((entry) => {
          this.$toggl.getProjectData(entry, (err, projectData) => {
            if (err) {
              console.log("error: ", err);
            } else {
              this.$store.commit("addProject", projectData);
              this.setGoals();
              this.setProjects();
            }
          });
        });
      } else {
        console.log("not getting projects");
        this.setGoals();
        this.setProjects();
      }
    },
  },
};
</script>

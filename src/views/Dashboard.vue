<template>
  <div>
    <div v-for="project in this.$store.state.projects" :key="project.id">
      {{ project.name }} {{ getTime(project.sum) }}
    </div>
    Goals:
    <div v-for="goal in this.goals" :key="goal.name">
      {{ goal.name }}
      <v-progress-linear
        :value="(100 / goal.min) * goal.value"
        color="amber"
        height="50"
      >
        <!-- {{ ((100 / goal.min) * goal.value).toFixed() }}% -->
        <br />
        {{ getTime(goal.value) }} / {{ getTime(goal.min) }}
      </v-progress-linear>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      projects: [],
      goals: [],
    };
  },
  created() {
    this.updateTimeEntries();

    console.log(this.getPreviousMonday());
  },
  methods: {
    getHours(seconds) {
      return (Math.round((seconds / 60 / 60) * 100) / 100).toFixed(2);
    },
    getMinutes(seconds) {
      return (Math.round((seconds / 60) * 100) / 100).toFixed(2);
    },
    getTime(seconds) {
      return new Date(seconds * 1000).toISOString().substr(11, 8);
    },
    getPreviousMonday() {
      var date = new Date();
      var day = date.getDay();
      var prevMonday = new Date();
      if (date.getDay() == 0) {
        prevMonday.setDate(date.getDate() - 7);
      } else {
        prevMonday.setDate(date.getDate() - (day - 1));
      }
      prevMonday.setHours(0, 0, 0, 0);
      return prevMonday.toISOString();
    },
    setDisplay() {
      this.projects = [];
      this.goals = [];
      this.$store.state.projectGoals.forEach((goal) => {
        console.log(
          goal,
          this.$store.state.projects.find((x) => x.name == goal.name)
        );
        let display = goal;
        display.value = this.$store.state.projects.find(
          (x) => x.name == goal.name
        ).sum;

        this.goals.push(display);
      });

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
              console.log("recieved: ", timeEntries.length);
              this.$store.commit("setTimeEntries", timeEntries);
              this.updateProjects();
            }
          }
        );
      } else {
        console.log("not getting timeEntries");
        this.updateProjects();
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
        console.log("uniques: ", uniqueProjects);
        uniqueProjects.forEach((entry) => {
          this.$toggl.getProjectData(entry, (err, projectData) => {
            if (err) {
              console.log("error: ", err);
            } else {
              this.$store.commit("addProject", projectData);
              this.setDisplay();
            }
          });
        });
      } else {
        console.log("not getting projects");
        this.setDisplay();
      }
    },
  },
};
</script>

<template>
  <div>
    <div v-for="goal in this.goals" :key="goal.name">
      <v-progress-linear
        :value="(100 / goal.min) * goal.value"
        :color="goal.hex_color"
        height="50"
      >
        <div style="margin-right: 5%">
          {{ goal.name }}
        </div>
        {{ ((100 / goal.min) * goal.value).toFixed(2) }}%
        <br />
        {{ getTime(goal.value) }} / {{ getTime(goal.min) }}
      </v-progress-linear>
    </div>
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
  },
  methods: {
    getTime(seconds) {
      const d = Number(seconds);
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      const hDisplay =
        h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : "00";
      const mDisplay =
        m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : "00";
      const sDisplay =
        s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : "00";
      return `${hDisplay}:${mDisplay}:${sDisplay}`;
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
        let goalProj = this.$store.state.projects.find(
          (x) => x.name == goal.name
        );
        if (goalProj) {
          let display = goal;
          display.hex_color = goalProj.hex_color;
          display.value = goalProj.sum;
          this.goals.push(display);
        }
      });
      this.$store.state.entriesGoals.forEach((goal) => {
        let goalEntries = [];
        let goalSum = 0;
        this.$store.state.timeEntries.forEach((entry) => {
          if (entry.description == goal.name && entry.duration > 0) {
            goalEntries.push(entry);
            goalSum += entry.duration;
          }
        });

        let goalProj = this.$store.state.projects.find(
          (x) => x.id == goalEntries[0].pid
        );
        if (goalProj) {
          let display = goal;
          display.hex_color = goalProj.hex_color;
          display.value = goalSum;

          this.goals.push(display);
        }
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

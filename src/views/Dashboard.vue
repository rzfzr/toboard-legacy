<template>
  <div>
    <div v-for="project in this.$store.state.projects" :key="project.id">
      {{ project.name }} {{ (project.sum / 60 / 60).toFixed(2) }} Hours
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
    };
  },
  created() {
    this.updateTimeEntries();
  },

  methods: {
    setDisplay() {
      this.$store.state.projects.forEach((proj) => {
        let display = proj;
        display.sum = 0;
        this.$store.state.timeEntries.forEach((entry) => {
          if (entry.pid == proj.id) {
            display.sum += entry.duration;
          }
        });
        this.projects.push(display);
      });
    },
    updateTimeEntries() {
      if (this.$store.state.timeEntries.length == 0) {
        console.log("getting timeEntries");
        this.$toggl.getTimeEntries(null, null, (err, timeEntries) => {
          if (err) {
            console.log("error: ", err);
          } else {
            console.log("recieved: ", timeEntries.length);
            this.$store.commit("setTimeEntries", timeEntries);
            this.updateProjects();
          }
        });
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

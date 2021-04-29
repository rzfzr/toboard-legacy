<template>
  <div>
    <div v-for="project in this.$store.state.projects" :key="project.id">
      {{ project.sum / 60 }} minutes
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {};
  },
  created() {
    console.log(this.$store.state.time);
    if (this.$store.state.timeEntries.length == 0) {
      console.log("getting timeEntries");
      this.$toggl.getTimeEntries(null, null, (err, timeEntries) => {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("recieved: ", timeEntries.length);
          this.$store.commit("setTimeEntries", timeEntries);
        }
      });
    } else {
      console.log("not getting timeEntries");
    }

    this.$store.state.timeEntries.forEach((entry) => {
      if (entry.pid == 161873998) {
        this.$store.state.projects[0].sum += entry.duration;
      }
    });

    console.log(this.$store.state.projects);
  },
};
</script>

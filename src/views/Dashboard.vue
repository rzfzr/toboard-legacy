<template>
  <div>Dashboard</div>
</template>

<script>
export default {
  name: "Dashboard",
  components: {},
  created() {
    if (this.$store.state.timeEntries.length == 0) {
      console.log("getting timeEntries");
      this.$toggl.getTimeEntries(null, null, (err, timeEntries) => {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("recieved: ", timeEntries);
          this.$store.commit("setTimeEntries", timeEntries);
        }
      });
    } else {
      console.log("not getting timeEntries");
    }
  },
};
</script>

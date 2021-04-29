<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
var TogglClient = require("toggl-api");
var toggl = new TogglClient({ apiToken: "XXX" });

export default {
  name: "App",
  data: () => ({}),

  mounted() {
    toggl.startTimeEntry(
      {
        description: "Some cool work",
        billable: true,
      },
      function (err, timeEntry) {
        // handle error

        // working 10 seconds
        setTimeout(function () {
          toggl.stopTimeEntry(timeEntry.id, function () {
            // handle error

            toggl.updateTimeEntry(
              timeEntry.id,
              { tags: ["finished"] },
              function () {
                toggl.destroy();
              }
            );
          });
        }, 120000);
      }
    );
  },
};
</script>

<template>
  <v-app>
    <div style="height: 50px">
      <v-hover v-slot="{ hover }">
        <v-app-bar app color="#333333">
          <div
            v-if="!hover"
            class="text-center"
            style="
              color: #6a53f9;
              font-weight: 900;
              font-size: 40px;
              width: 100%;
            "
          >
            toboard
          </div>
          <v-tabs
            v-else
            class="tabs"
            centered
            grow
            v-model="activeTab"
            color="#6a53f9"
            background-color="#333333"
          >
            <v-tab v-for="tab in tabs" :key="tab.route" :to="tab.route" exact>
              {{ tab.name }}
            </v-tab>
          </v-tabs>

          <!-- <v-expand-transition style="height: 100%">
          <div v-if="hover" style="height: 100%">
          </div>
        </v-expand-transition> -->
        </v-app-bar>
      </v-hover>
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import datesMixin from "./mixins/dates";
import togglMixin from "./mixins/toggl";

export default {
  mixins: [datesMixin, togglMixin],
  data() {
    return {
      goals: [],
      projects: [],
      showTabs: false,
      activeTab: `/user/`,
      tabs: [
        { name: "Home", route: `/home` },
        { name: "List", route: `/list` },
        { name: "Timeline", route: `/timeline` },
        // { name: "Daily", route: `/dashboard` },
        { name: "Weekly", route: `/weekly` },
        // { name: "Monthly", route: `/dashboard` },
        // { name: "Yearly", route: `/dashboard` },
        { name: "Favorites", route: `/favorites` },
        { name: "Settings", route: `/settings` },
      ],
    };
  },
  async created() {
    console.log("created app");
    await this.updateTimeEntries();
    await this.updateProjects();
    await this.setGoals();
    await this.setProjects();
    console.log("fininhed creating app");
    // this.$router.push("/weekly").catch(() => {});
  },
  methods: {
    async updateTimeEntries() {
      console.log("updatingTimeEntries");
      var today = new Date();
      this.$toggl.getTimeEntries(
        this.getPreviousMonday(),
        today.toISOString(),
        (err, timeEntries) => {
          if (err) {
            console.log("error: ", err);
          } else {
            this.$store.commit("setTimeEntries", timeEntries);

            let running = this.$store.state.timeEntries.find(
              (x) => x.duration < 0
            );
            this.$store.commit("setRunningEntry", running);
          }
        }
      );
    },
    async updateProjects() {
      console.log("updatingProjects");
      let uniqueProjects = [
        ...new Set(this.$store.state.timeEntries.map((item) => item.pid)),
      ];
      uniqueProjects.forEach((entry) => {
        this.$toggl.getProjectData(entry, (err, projectData) => {
          console.log(err, projectData);
          if (err) {
            console.log("error: ", err);
          } else {
            this.$store.commit("addProject", projectData);
          }
        });
      });
    },
    async setProjects() {
      console.log("settingProjects");
      this.$store.state.projects.forEach((proj) => {
        proj.sum = 0;
        this.$store.state.timeEntries.forEach((entry) => {
          if (entry.pid == proj.id) {
            if (entry.duration > 0) proj.sum += entry.duration;
          }
        });
      });
    },
    async setGoals() {
      console.log("settingGoals");
      this.$store.state.goals.forEach((goal) => {
        let goalProj = this.$store.state.projects.find(
          (x) => x.name == goal.project
        );
        goal.hex_color = goalProj ? goalProj.hex_color : "#808080";
        goal.value = goal.description
          ? this.getSumEntries(goal.description)
          : goalProj
          ? goalProj.sum
          : 0;
      });
      if (this.goals.length == this.$store.state.goals.length)
        this.$store.commit("setGoals", this.goals);
    },
  },
};
</script>

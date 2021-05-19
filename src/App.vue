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
    console.log("fininhed creating app");
    // this.$router.push("/weekly").catch(() => {});
  },
  methods: {
    async updateTimeEntries() {
      console.log("updatingTimeEntries");

      await this.$toggl.getTimeEntries(
        this.getPreviousMonday(),
        new Date().toISOString(),
        async (err, timeEntries) => {
          if (err) {
            console.log("error: ", err);
          } else {
            await this.$store.dispatch("setTimeEntries", timeEntries);
            let running = this.$store.state.timeEntries.find(
              (x) => x.duration < 0
            );
            this.$store.commit("setRunningEntry", running);
            await this.updateProjects();
          }
        }
      );
    },
    async updateProjects() {
      let uniqueProjects = [
        ...new Set(this.$store.state.timeEntries.map((item) => item.pid)),
      ];
      console.log("updatingProjects", uniqueProjects);
      uniqueProjects.forEach((entry) => {
        this.$toggl.getProjectData(entry, (err, projectData) => {
          if (err) {
            console.log("error: ", err);
          } else {
            projectData.sum = 0;
            this.$store.state.timeEntries.forEach((entry) => {
              if (entry.pid == projectData.id) {
                if (entry.duration > 0) projectData.sum += entry.duration;
              }
            });
            this.$store.commit("addProject", projectData);
            this.setGoals();
          }
        });
      });
    },
    async setGoals() {
      console.log("settingGoals");
      this.$store.state.goals.forEach((goal) => {
        let goalProj = this.$store.state.projects.find((x) => x.id == goal.pid);
        goal.hex_color = goalProj ? goalProj.hex_color : "#808080";
        goal.value = goal.description
          ? this.getSumEntries(goal.description)
          : goalProj
          ? goalProj.sum
          : 0;

        // goal = goal || goalProj;
        console.log("setting goals, project: ", goal, goalProj);
      });
      console.log("setting goals :", this.$store.state.goals);
      this.$store.commit("setGoals", this.$store.state.goals);
    },
  },
};
</script>

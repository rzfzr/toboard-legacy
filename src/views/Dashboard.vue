<template>
  <div>
    <v-hover v-slot:default="{ hover }">
      <v-card
        :elevation="hover ? 12 : 2"
        class="mx-auto"
        height="50"
        max-width="650"
        color="dark"
      >
        <v-progress-linear
          :value="(100 / 168) * getProgress()"
          color="grey"
          height="50"
        >
          <div style="margin-right: 5%">Week (placeholder/idea)</div>
          {{ getProgress().toFixed() }} / {{ 168 }} ({{
            ((100 / 168) * getProgress()).toFixed(2)
          }}%)
        </v-progress-linear>
      </v-card>
    </v-hover>

    <v-hover
      v-slot:default="{ hover }"
      v-for="goal in this.goals"
      :key="goal.name"
    >
      <v-card
        :elevation="hover ? 12 : 2"
        class="mx-auto"
        height="50"
        max-width="550"
        color="dark"
      >
        <v-progress-linear
          :value="(100 / goal.min) * goal.value"
          :color="goal.hex_color"
          :stream="goal.isRunning"
          buffer-value="0"
          height="50"
        >
          <div style="margin-right: 5%">
            {{ goal.name }}
          </div>
          <v-btn
            v-show="hover"
            fab
            small
            :color="colorShade(goal.hex_color, +40)"
          >
            <v-icon dark v-if="goal.isRunning"> mdi-pause </v-icon>
            <v-icon dark v-else> mdi-play </v-icon>
          </v-btn>
          <div style="margin-left: 5%">
            {{ getTime(goal.value) }} / {{ getTime(goal.min) }} ({{
              ((100 / goal.min) * goal.value).toFixed(2)
            }}%)
          </div>
        </v-progress-linear>
      </v-card>
    </v-hover>

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
    getProgress() {
      var date = new Date().toISOString();
      let mon = this.getPreviousMonday();
      return Math.abs(Date.parse(date) - Date.parse(mon)) / 36e5;
    },
    colorShade(col, amt) {
      col = col.replace(/^#/, "");
      if (col.length === 3)
        col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

      let [r, g, b] = col.match(/.{2}/g);
      [r, g, b] = [
        parseInt(r, 16) + amt,
        parseInt(g, 16) + amt,
        parseInt(b, 16) + amt,
      ];

      r = Math.max(Math.min(255, r), 0).toString(16);
      g = Math.max(Math.min(255, g), 0).toString(16);
      b = Math.max(Math.min(255, b), 0).toString(16);

      const rr = (r.length < 2 ? "0" : "") + r;
      const gg = (g.length < 2 ? "0" : "") + g;
      const bb = (b.length < 2 ? "0" : "") + b;

      return `#${rr}${gg}${bb}`;
    },
    getTime(seconds) {
      const d = Number(seconds);
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      // const s = Math.floor((d % 3600) % 60);
      const hDisplay =
        h > 0 ? `${h.toString().length > 1 ? `${h}` : `${0}${h}`}` : "00";
      const mDisplay =
        m > 0 ? `${m.toString().length > 1 ? `${m}` : `${0}${m}`}` : "00";
      // const sDisplay =
      //   s > 0 ? `${s.toString().length > 1 ? `${s}` : `${0}${s}`}` : "00";
      // return `${hDisplay}:${mDisplay}:${sDisplay}`;
      return `${hDisplay}:${mDisplay}`;
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
          //check if project is current
          if (
            this.$store.state.timeEntries.findIndex(
              (x) => x.pid == goalProj.id && x.duration < 0
            ) != -1
          ) {
            goal.isRunning = true;
          } else {
            goal.isRunning = false;
          }

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

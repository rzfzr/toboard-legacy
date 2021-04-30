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
      :key="goal.project + goal.description"
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
            {{ goal.description }} {{ goal.project }}
          </div>
          <v-btn
            v-show="hover"
            fab
            small
            :color="colorShade(goal.hex_color, +40)"
            @click="toggle(goal.description, goal.project)"
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
    createEntry(description, project) {
      this.$toggl.startTimeEntry(
        {
          description: description,
          pid: this.$store.state.projects.find((x) => x.name == project).id,
        },
        (err, timeEntry) => {
          if (err) console.log(err);
          else {
            console.log("succefully started: ", timeEntry);
            this.$store.state.timeEntries.push(timeEntry);
          }
        }
      );
    },

    toggle(description, project) {
      this.$toggl.getCurrentTimeEntry((err, timeEntry) => {
        if (err) console.log(err);
        else {
          if (timeEntry) {
            console.log("something already running ");
            if (timeEntry.description == description) {
              this.$toggl.stopTimeEntry(timeEntry.id, (err, timeEntry) => {
                if (err) console.log(err);
                else console.log("succefully stopped ", timeEntry);
              });
            } else {
              this.createEntry(description, project);
            }
          } else {
            this.createEntry(description, project);
          }
        }
      });
    },
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

    checkIfRunning(project) {
      return (
        this.$store.state.timeEntries.findIndex(
          (x) => x.pid == project.id && x.duration < 0
        ) != -1
      );
    },

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
    setDisplay() {
      this.projects = [];
      this.goals = [];
      this.$store.state.goals.forEach((goal) => {
        let goalProj = this.$store.state.projects.find(
          (x) => x.name == goal.project
        );
        if (goalProj) {
          let display = goal;
          display.hex_color = goalProj.hex_color;
          display.isRunning = this.checkIfRunning(goalProj);
          display.value = goal.description
            ? this.getSumEntries(goal.description)
            : goalProj.sum;
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

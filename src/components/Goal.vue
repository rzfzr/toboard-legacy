<template>
  <v-hover v-slot:default="{ hover }">
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
</template>

<script>
export default {
  name: "goal",
  data: () => ({}),
  props: {
    goal: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    console.log("component", this.goal);
  },
  methods: {
    getTime(seconds, showSeconds = false) {
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
      if (showSeconds) return `${hDisplay}:${mDisplay}:${sDisplay}`;
      else return `${hDisplay}:${mDisplay}`;
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
  },
};
</script>

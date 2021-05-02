<template>
  <v-btn
    fab
    small
    :color="colorShade(entry.hex_color || project.hex_color, +40)"
    @click="toggle(entry.description, entry.project || project)"
  >
    <v-icon dark v-if="entry.isRunning"> mdi-pause </v-icon>
    <v-icon dark v-else> mdi-play </v-icon>
  </v-btn>
</template>

<script>
import togglMixin from "../mixins/toggl";

export default {
  name: "ToggleButton",
  mixins: [togglMixin],
  data: () => ({}),
  props: {
    entry: {
      type: Object,
      default: function () {
        return {};
      },
    },
    project: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  methods: {
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

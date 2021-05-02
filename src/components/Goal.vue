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
        <toggle-button :entry="goal" v-show="hover" />
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
import ToggleButton from "./ToggleButton.vue";
import datesMixin from "../mixins/dates";
import togglMixin from "../mixins/toggl";

export default {
  name: "goal",
  mixins: [datesMixin, togglMixin],
  components: {
    ToggleButton,
  },
  data: () => ({}),
  props: {
    goal: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  methods: {},
};
</script>

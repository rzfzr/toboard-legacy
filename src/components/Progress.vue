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
        :value="(100 / 168) * getWeekProgress()"
        color="grey"
        height="50"
        buffer-value="0"
        stream
      >
        <div style="margin-right: 5%">Week Progress</div>
        {{ getWeekProgress().toFixed() }} / {{ 168 }} ({{
          ((100 / 168) * getWeekProgress()).toFixed(2)
        }}%)
      </v-progress-linear>
    </v-card>
  </v-hover>
</template>
<script>
import datesMixin from "../mixins/dates";
export default {
  name: "my-progress",
  mixins: [datesMixin],
  methods: {
    getWeekProgress() {
      var date = new Date().toISOString();
      let mon = this.getPreviousMonday();
      return Math.abs(Date.parse(date) - Date.parse(mon)) / 36e5;
    },
  },
};
</script>

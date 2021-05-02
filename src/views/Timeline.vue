<template>
  <div class="about">
    <v-row justify="center" class="mx-auto">
      <v-col>
        <v-sheet height="500">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-calendar
            ref="calendar"
            v-model="value"
            type="week"
            :events="events"
          >
            <template v-slot:day-body="{ date, week }">
              <div
                class="v-current-time"
                :class="{ first: date === week[0].date }"
                :style="{ top: nowY }"
              ></div>
            </template>
          </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import datesMixin from "../mixins/dates";
import togglMixin from "../mixins/toggl";
export default {
  name: "Timeline",
  mixins: [datesMixin, togglMixin],
  data: () => ({
    value: "",
    ready: false,
    today: "2021-05-02",
    events: [],
  }),
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
  },
  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();

    this.$store.state.timeEntries.forEach((entry) => {
      if (!isNaN(new Date(entry.stop).getTime())) {
        this.events.push({
          name: entry.description,
          start: this.getCalendarFormat(new Date(entry.start)),
          end: this.getCalendarFormat(new Date(entry.stop)),
          color: this.getProject(entry).hex_color,
        });
      }
    });
    console.log("events:", this.events);
  },
  methods: {
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
  },
};
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
</style>
<template>
  <div class="about">
    <v-row justify="center" style="width: 340px" class="mx-auto">
      <v-expansion-panels accordion multiple v-model="panel">
        <v-expansion-panel v-for="day in this.days" :key="day.label">
          <v-expansion-panel-header>{{ day.label }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card
              class="mx-auto"
              max-width="340"
              elevation="24"
              outlined
              v-for="entry in day.entries"
              :key="entry.id"
              style="margin-top: 5px"
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="headline mb-1"
                    >{{ entry.description }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    :style="{ color: getProject(entry).hex_color }"
                  >
                    {{ getProject(entry).name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar>
                  {{ getTime(entry.duration) }}</v-list-item-avatar
                >
              </v-list-item>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
import datesMixin from "../mixins/dates";
import togglMixin from "../mixins/toggl";
export default {
  name: "List",
  mixins: [datesMixin, togglMixin],
  data() {
    return {
      days: [],
      panel: [0, 1, 2, 3, 4, 5, 6],
    };
  },
  created() {
    this.$store.state.timeEntries.forEach((entry) => {
      var entryDate = this.formatDate(new Date(entry.start));
      let day = this.days.find((d) => d.label == entryDate);
      if (!day) {
        this.days.push({ label: entryDate });
        day = this.days.find((d) => d.label == entryDate);
      }

      if (!day.entries) day.entries = [];

      day.entries.push(entry);

      // let day = date.getDay() + "/" + date.getMonth();
    });
    console.log(this.days);
  },
};
</script>



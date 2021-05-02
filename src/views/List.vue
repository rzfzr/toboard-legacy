<template>
  <div class="about">
    <v-row justify="center" style="max-width: 400px" class="mx-auto">
      <v-expansion-panels accordion multiple v-model="panel">
        <v-expansion-panel v-for="day in this.days" :key="day.label">
          <v-expansion-panel-header>{{ day.label }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-hover
              v-slot:default="{ hover }"
              class="mx-auto"
              max-width="340"
              outlined
              v-for="entry in day.entries"
              :key="entry.id"
              style="margin-top: 5px"
            >
              <v-card :elevation="hover ? 24 : 4">
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
                  <toggle-button
                    :entry="entry"
                    :project="getProject(entry)"
                    v-show="hover"
                  />
                  <v-list-item-avatar>
                    {{ getTime(entry.duration) }}
                  </v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-hover>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
import ToggleButton from "../components/ToggleButton";
import datesMixin from "../mixins/dates";
import togglMixin from "../mixins/toggl";
export default {
  name: "List",
  mixins: [datesMixin, togglMixin],
  components: {
    ToggleButton,
  },
  data() {
    return {
      days: [],
      panel: [0, 1, 2, 3, 4, 5, 6],
    };
  },
  created() {
    let timeEntries = this.$store.state.timeEntries.sort((a, b) =>
      a.start < b.start ? 1 : -1
    );

    timeEntries.forEach((entry) => {
      var entryDate = this.formatDate(new Date(entry.start));
      let day = this.days.find((d) => d.label == entryDate);
      if (!day) {
        this.days.push({ label: entryDate });
        day = this.days.find((d) => d.label == entryDate);
      }
      if (!day.entries) day.entries = [];
      day.entries.push(entry);
    });

    this.days.sort();
    console.log(this.days);
  },
};
</script>



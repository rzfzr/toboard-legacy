<template>
  <v-container class="pa-4 text-center">
    <v-row class="fill-height" align="center" justify="center">
      <template v-for="(item, i) in items">
        <v-col :key="i" cols="12" md="3">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              :color="item.project.hex_color"
            >
              <v-card-title class="title white--text">
                <v-row class="fill-height flex-column" justify="space-between">
                  <p class="mt-4 subheading text-left">
                    {{ item.description }}
                  </p>
                  <div>
                    <p
                      class="ma-0 body-1 font-weight-bold font-italic text-left"
                    >
                      {{ item.project.name }}
                    </p>
                  </div>
                </v-row>
                <v-row>
                  <toggle-button :entry="item" v-show="hover" />
                </v-row>
              </v-card-title>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script>
import ToggleButton from "../components/ToggleButton";
import datesMixin from "../mixins/dates";
import togglMixin from "../mixins/toggl";
export default {
  name: "Favorites",
  mixins: [datesMixin, togglMixin],
  data: () => ({
    items: [
      {
        description: "Lunch",
        project: "Personal",
        hex_color: "#eb4034",
      },
      {
        description: "Dinner",
        project: "Personal",
        hex_color: "#eb4034",
      },
      {
        description: "Breakfast",
        project: "Personal",
        hex_color: "#eb4034",
      },
      {
        description: "toboard",
        project: "ClicNet",
        hex_color: "#eb4034",
      },
      {
        description: "AThingADay",
        project: "ClicNet",
        hex_color: "#eb4034",
      },
      {
        description: "Media",
        project: "Fun",
        hex_color: "#eb4034",
      },
    ],
    transparent: "rgba(255, 255, 255, 0)",
  }),
  components: {
    ToggleButton,
  },
  created() {
    this.items.forEach((i) => {
      let project = this.$store.state.projects.find(
        (element) => element.name == i.project
      );
      i.project = project;
    });
  },
};
</script>

<style lang="scss">
// .v-card {
//   transition: opacity 0.4s ease-in-out;
// }

// .v-card:not(.on-hover) {
//   opacity: 0.6;
// }

// .show-btns {
//   color: rgba(255, 255, 255, 1) !important;
// }
</style>
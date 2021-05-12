<template>
  <v-app>
    <div style="height: 50px">
      <v-hover v-slot="{ hover }">
        <v-app-bar app color="#333333">
          <div
            v-if="!hover"
            class="text-center"
            style="
              color: #6a53f9;
              font-weight: 900;
              font-size: 40px;
              width: 100%;
            "
          >
            toboard
          </div>
          <v-tabs
            v-else
            class="tabs"
            centered
            grow
            v-model="activeTab"
            color="#6a53f9"
            background-color="#333333"
          >
            <v-tab v-for="tab in tabs" :key="tab.route" :to="tab.route" exact>
              {{ tab.name }}
            </v-tab>
          </v-tabs>

          <!-- <v-expand-transition style="height: 100%">
          <div v-if="hover" style="height: 100%">
          </div>
        </v-expand-transition> -->
        </v-app-bar>
      </v-hover>
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      showTabs: false,
      activeTab: `/user/`,
      tabs: [
        { name: "Home", route: `/home` },
        { name: "List", route: `/list` },
        { name: "Timeline", route: `/timeline` },
        // { name: "Daily", route: `/dashboard` },
        { name: "Weekly", route: `/dashboard` },
        // { name: "Monthly", route: `/dashboard` },
        // { name: "Yearly", route: `/dashboard` },
        { name: "Favorites", route: `/favorites` },
        { name: "Settings", route: `/settings` },
      ],
    };
  },
  mounted() {
    this.$router.push("/Dashboard").catch(() => {});
  },
};
</script>

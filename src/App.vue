<template>
  <v-app>
    <v-app-bar app color="#2C1338" dark>
      <v-spacer></v-spacer>
      <span style="color: #dd6fd1; font-weight: 900; font-size: 40px"
        >toboard</span
      >
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-tabs class="tabs" centered grow height="60px" v-model="activeTab">
        <v-tab v-for="tab in tabs" :key="tab.route" :to="tab.route" exact>
          {{ tab.name }}
        </v-tab>
      </v-tabs>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      activeTab: `/user/${this.id}`,
      tabs: [
        { name: "Home", route: `/home` },
        { name: "Weekly", route: `/Dashboard` },
      ],
    };
  },
  mounted() {
    this.$router.push("/Dashboard").catch(() => {});
  },
};
</script>

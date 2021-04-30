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
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  mounted() {
    this.$router.push("/Dashboard").catch(() => {});
  },
};
</script>

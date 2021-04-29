<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-spacer></v-spacer>
      <span class="mr-2">toboard</span>
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

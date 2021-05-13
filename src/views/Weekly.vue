<template>
  <div style="margin-left: 20px; margin-right: 20px">
    <my-progress />
    <goal
      v-for="goal in this.$store.state.goals"
      :key="goal.project + goal.description"
      v-bind:goal="goal"
    />
    <!-- <div
      style="margin: auto; width: 20%"
      v-for="project in this.$store.state.projects"
      :key="project.id"
    >
      {{ project.name }} {{ getTime(project.sum) }}
    </div> -->
  </div>
</template>
<script>
import Goal from "../components/Goal.vue";
import MyProgress from "../components/Progress.vue";

export default {
  name: "Dashboard",
  components: {
    Goal,
    MyProgress,
  },
  data() {
    return {
      projects: [],
      goals: [],
    };
  },
};
</script>
<style>
.v-progress-linear__stream {
  -webkit-animation: stream-ltr 0.5s linear infinite;
  animation: stream-ltr 0.5s linear infinite;
  border-top: 8px dotted;
}
@keyframes stream-ltr {
  100% {
    transform: translateX(-16px);
  }
}
</style>
  <template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script>

const default_layout = "dashboard-layout";
export default {
  name: "App",
  setup() {
  },

  computed: {
    layout() {
      return this.$route.meta.layout || default_layout;
    },
  },
};
</script>

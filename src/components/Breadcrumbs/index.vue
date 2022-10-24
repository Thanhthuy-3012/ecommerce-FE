<template>
  <v-breadcrumbs :items="breadCrumbs" class="px-0">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :to="item.to"
        class="text-subtitle-2 crumb-item"
        :disabled="breadCrumbs[breadCrumbs.length - 1].text == item.text"
        exact
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: "BreadCrumbs",
  data() {
    return {
      items: {},
    };
  },
  computed: {
    breadCrumbs() {
      return this.$route.meta.breadCrumb;
    },
  },
};
</script>

<style></style>

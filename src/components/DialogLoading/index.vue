<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="text-center">
    <v-dialog
      v-model="isLoading"
      :hide-overlay="!overlay"
      persistent
      width="300"
    >
      <v-card color="info" dark>
        <v-card-text>
          {{ message }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import i18n from "@/i18n";
export default {
  name: "Loading",
  props: {
    overlay: {
      default: true,
      type: Boolean,
    },
    message: {
      default: i18n.t("label.loading"),
      type: String,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped></style>

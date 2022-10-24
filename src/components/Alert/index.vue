<template>
  <div class="text-center">
    <v-snackbar
      :value="visible"
      :timeout="timeout"
      :color="colors[type]"
      absolute
      right
      top
    >
      <v-icon>{{ icons[type] }}</v-icon>
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="closePopUp()"
        >
        <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    type: {
      default: "success",
      type: String,
    },
    visible: {
      default: false,
      type: Boolean,
    },
    message: String,
    timeout: {
      default: 2000,
      type: Number,
    },
  },
  data: () => ({
    icons: {
      success: "mdi-checkbox-marked-circle",
      error: "mdi-alert-octagon-outline",
      warning: "mdi-alert-outline",
      info: "mdi-information-outline",
    },
    colors: {
      success: "#4caf50",
      error: "#ff5252",
      warning: "#fb8c00 ",
      info: "#2196f3",
    },
  }),
  methods: {
    closePopUp() {
      this.$emit('update:value', false)
    }
  }
};
</script>

<style lang="scss" scoped>
  .btn-close {
    font-size: 20px;
  }
  .v-btn.v-size--default {
    height: 30px;
    min-width: 30px;
  }
</style>

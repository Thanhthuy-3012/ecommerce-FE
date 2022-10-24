<template>
  <v-form>
    <v-container class="login">
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="email"
            label="Email"
            :error-messages="emailErrors"
            required
            outlined
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="password"
            label="Password"
            required
            outlined
            :error-messages="passwordErrors"
            :append-icon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShowPass ? 'text' : 'password'"
            @click:append="isShowPass = !isShowPass"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
          ></v-text-field>
        </v-col>
        <div class="d-flex align-center justify-center btn-login">
          <v-btn
            class="mr-4"
            color="error"
            @click="submit"
            :loading="loading"
            :disabled="loading"
          >
            {{ "Login" }}
          </v-btn>
        </div>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { loginStore } from "@/store/shop/login";
import { mapState } from "pinia";
import { CONSTANTS } from "@/utils";

export default {
  name: "SingIn",
  setup() {
    const storeLogin = loginStore();
    return {
      storeLogin,
    };
  },
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },

  data: () => ({
    isShowPass: false,
    email: "",
    password: "",
    option: {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "6000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
      },
  }),

  computed: {
    ...mapState(loginStore, ["success", "loading", "data", "message"]),
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Email invalid fomart");
      !this.$v.email.required && errors.push("Email is required");
      return errors;
    },
  },

  methods: {
    async submit() {
      this.storeLogin.$patch({ success: null, message: null });
      const request = {
        email: this.email.trim(),
        password: this.password,
      };
      this.$v.$touch();
      this.$toastr.remove();
      if (!this.$v.$error) {
        await this.storeLogin.login(request);
        if (this.success) {
          localStorage.setItem(CONSTANTS.TOKEN, this.data.access_token);
          localStorage.setItem('isAdmin', 0);
          window.location.href = '/'
        } else {
          this.$toastr.error(this.message, "", this.option);
        }
      }
    },
  },

  created() {},
};
</script>
<style lang="scss">
.login {
  width: 400px;
  margin-top: 130px;
  .btn-login {
    width: 100%;
  }
}
</style>

<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="user-page">
    <div class="d-flex wrapper-btn">
      <v-btn depressed color="primary" @click="openPopupCreateOrEdit()">
        Create
      </v-btn>
    </div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        class="elevation-1"
        :items-per-page="10"
        :loading="loading"
        :loading-text="messageLoading"
      >
        <template v-slot:[`item.birthday`]="{ item }">
          {{ item.birthday | fomartDate }}
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex">
            <v-icon
              class="mr-3"
              color="primary"
              @click="openPopupCreateOrEdit(item.id, item)"
              :disabled="loading"
              >mdi-pencil-outline
            </v-icon>
            <v-icon
              @click="openPopupDelete(item.id)"
              :disabled="loading"
              color="red"
              >mdi-delete</v-icon
            >
          </div>
        </template>
      </v-data-table>

      <!-- Dialog Delete -->
      <div class="text-center">
        <v-dialog v-model="isOpenDialogDelete" persistent width="500">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure delete user?
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="gray darken-1" text @click="cancelDelete">
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="handleDelete"
                :loading="loading"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!-- Dialog Create or Update -->
      <div class="text-center">
        <v-dialog v-model="isOpenDialogCreateOrEdit" persistent width="500">
          <v-card>
            <v-card-title class="text-h5">
              {{ this.id ? "Update User" : "Create User" }}
            </v-card-title>
            <div class="form-create-edit">
              <v-text-field
                v-model="dataUser.user_name"
                :error-messages="userNameErrors"
                @input="$v.dataUser.user_name.$touch()"
                @blur="$v.dataUser.user_name.$touch()"
                label="User Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="dataUser.email"
                :error-messages="emailErrors"
                @input="$v.dataUser.email.$touch()"
                @blur="$v.dataUser.email.$touch()"
                label="Email"
                required
              ></v-text-field>
              <!-- <v-text-field
                v-if="id"
                placeholder="************"
                type="password"
                v-model="dataUser.password"
                label="Password"
              ></v-text-field> -->
              <v-text-field
                placeholder="************"
                v-model="dataUser.password"
                label="Password"
                :error-messages="passwordErrors"
                @input="$v.dataUser.password.$touch()"
                @blur="$v.dataUser.password.$touch()"
                :append-icon="isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isShowPass ? 'text' : 'password'"
                @click:append="isShowPass = !isShowPass"
                :required="id ? false : true"
              ></v-text-field>
              <v-radio-group v-model="dataUser.gender" row>
                <v-radio label="Male" value="Male"></v-radio>
                <v-radio label="Female" value="Female"></v-radio>
              </v-radio-group>
              <v-text-field
                type="number"
                v-model="dataUser.phone_number"
                :error-messages="phoneErrors"
                @input="$v.dataUser.phone_number.$touch()"
                @blur="$v.dataUser.phone_number.$touch()"
                label="Phone Number"
                required
              ></v-text-field>
              <v-text-field
                v-model="dataUser.address"
                :error-messages="addressErrors"
                @input="$v.dataUser.address.$touch()"
                @blur="$v.dataUser.address.$touch()"
                label="Address"
                required
              ></v-text-field>

              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dataUser.birthday"
                    label="Birthday"
                    persistent-hint
                    v-bind="attrs"
                    :error-messages="birthdayErrors"
                    @input="$v.dataUser.address.$touch()"
                    @blur="handleDate"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
              <v-select
                v-model="dataUser.role_id"
                :items="dataRole"
                item-text="name_role"
                item-value="id"
                label="Role"
              ></v-select>
            </div>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="gray darken-1" text @click="cancelUpdateOrCreate">
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                text
                :loading="loading"
                @click="handleClick"
              >
                {{ this.id ? "Update" : "Create" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { userStore } from "@/store/admin/user";
import { roleStore } from "@/store/admin/role";
import { mapState } from "pinia";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "UserPage",
  mixins: [validationMixin],
  validations: {
    dataUser: {
      user_name: {
        required,
      },
      phone_number: {
        required,
      },
      password: {
        isRequired() {
          if (!this.id && !this.dataUser?.password) {
            return false
          }
          return true;
        },
      },
      address: {
        required,
      },
      birthday: {
        required,
      },
      email: {
        required,
        email,
      },
    },
  },
  data() {
    return {
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu1: false,
      isShowPass: false,
      messageLoading: this.$t("label.loading"),
      search: "",
      isOpenDialogDelete: false,
      isOpenDialogCreateOrEdit: false,
      id: null,
      dataUser: {
        user_name: null,
        password: null,
        gender: null,
        phone_number: null,
        address: null,
        birthday: null,
        email: null,
        role_id: null,
      },
      defaultDetail: {
        user_name: null,
        password: null,
        gender: null,
        phone_number: null,
        address: null,
        birthday: null,
        email: null,
        role_id: null,
      },
      headers: [
        {
          text: "Email",
          align: "center",
          value: "email",
        },
        {
          text: "Address",
          align: "center",
          value: "address",
        },
        {
          text: "Birthday",
          align: "center",
          value: "birthday",
        },
        {
          text: "Phone Number",
          align: "center",
          value: "phone_number",
        },
        {
          text: "Gender",
          align: "center",
          value: "gender",
        },
        {
          text: "Action",
          align: "center",
          value: "action",
          filterable: false,
          sortable: false,
        },
      ],
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
    };
  },
  setup() {
    const storeUser = userStore();
    const storeRole = roleStore();
    return {
      storeUser,
      storeRole,
    };
  },

  watch: {
    async message() {
      if (this.message) {
        this.$toastr.remove();
        if (this.success) {
          await this.storeUser.list();
          this.cancelDelete();
          this.cancelUpdateOrCreate();
          this.$toastr.success(this.message, "", this.option);
        } else {
          this.$toastr.error(this.message, "", this.option);
        }
      }
      this.storeUser.$patch({ success: null, message: null });
    },

    date() {
      this.dataUser.birthday = this.formatDate(this.date);
    },
  },
  methods: {
    async handleClick() {
      this.$v.dataUser.$touch();
      if (!this.$v.dataUser.$error) {
        const request = {
          ...this.dataUser,
          gender: this.dataUser.gender == "Male" ? 0 : 1,
        };

        if (this.id) {
          await this.storeUser.edit(this.id, request);
        } else {
          await this.storeUser.create(request);
        }
      }
    },

    handleDate() {
      this.$v.dataUser.birthday.$touch();
      this.date = this.parseDate(this.dataUser.birthday);
    },

    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}/${month}/${day}`;
    },

    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
    },

    openPopupDelete(id) {
      (this.id = id), (this.isOpenDialogDelete = true);
    },

    async openPopupCreateOrEdit(id = null, item = null) {
      if (id) {
        this.id = id;
      }
      if (item) {
        this.dataUser = { ...item };
        this.dataUser.birthday = this.formatDate(this.dataUser.birthday);
      } else {
        this.dataUser.gender = "Male";
      }
      this.isOpenDialogCreateOrEdit = true;
    },

    cancelDelete() {
      (this.id = null), (this.isOpenDialogDelete = false);
    },

    cancelUpdateOrCreate() {
      (this.id = null),
        (this.dataUser = this.defaultDetail),
        (this.isOpenDialogCreateOrEdit = false);
      this.$v.dataUser.$reset();
    },

    async fetch() {
      await this.storeUser.list();
      await this.storeRole.list();
    },

    async handleDelete() {
      await this.storeUser.delete(this.id);
    },
  },
  computed: {
    ...mapState(userStore, ["success", "loading", "data", "message"]),
    ...mapState(roleStore, {
      successRole: "success",
      loadingRole: "loading",
      dataRole: "data",
      messageRole: "message",
    }),

    passwordErrors() {
      const errors = [];
        if (!this.$v.dataUser.password.$dirty) return errors;
        !this.$v.dataUser.password.isRequired &&
          errors.push("Password is required");
      return errors;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.dataUser.email.$dirty) return errors;
      !this.$v.dataUser.email.email && errors.push("Email invalid fomart");
      !this.$v.dataUser.email.required && errors.push("Email is required");
      return errors;
    },

    userNameErrors() {
      const errors = [];
      if (!this.$v.dataUser.user_name.$dirty) return errors;
      !this.$v.dataUser.user_name.required &&
        errors.push("User Name is required");
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.dataUser.phone_number.$dirty) return errors;
      !this.$v.dataUser.phone_number.required &&
        errors.push("Phone Number is required");
      return errors;
    },

    addressErrors() {
      const errors = [];
      if (!this.$v.dataUser.address.$dirty) return errors;
      !this.$v.dataUser.address.required && errors.push("Address is required");
      return errors;
    },

    birthdayErrors() {
      const errors = [];
      if (!this.$v.dataUser.birthday.$dirty) return errors;
      !this.$v.dataUser.birthday.required &&
        errors.push("Birthday is required");
      return errors;
    },
  },

  mounted() {
    this.fetch();
  },
};
</script>

<style lang="scss" scope>
.wrapper-btn {
  justify-content: end;
  padding-bottom: 10px;
}
.form-create-edit {
  width: 400px;
  margin: 0 auto;
}
.sortable .v-data-table-header__icon {
  padding-left: 7px;
}

.sortable.desc .v-data-table-header__icon {
  padding-right: 7px;
  padding-left: 0px;
}
</style>

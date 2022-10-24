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
        :items="dataRole"
        :search="search"
        class="elevation-1"
        :items-per-page="10"
        :loading="loadingRole"
        :loading-text="messageLoading"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex" style="justify-content: center">
            <v-icon
              class="mr-3"
              color="primary"
              @click="openPopupCreateOrEdit(item.id, item)"
              :disabled="loadingRole"
              >mdi-pencil-outline
            </v-icon>
            <v-icon
              @click="openPopupDelete(item.id)"
              :disabled="loadingRole"
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
              Are you sure delete role?
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
                :loading="loadingRole"
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
                v-model="name_role"
                :error-messages="roleErrors"
                @input="$v.name_role.$touch()"
                @blur="$v.name_role.$touch()"
                label="Name Role"
                required
              ></v-text-field>
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
                :loading="loadingRole"
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
import { roleStore } from "@/store/admin/role";
import { mapState } from "pinia";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "RolePage",
  mixins: [validationMixin],
  validations: {
    name_role: {
      required,
    },
  },
  data() {
    return {
      messageLoading: this.$t("label.loading"),
      search: "",
      isOpenDialogDelete: false,
      isOpenDialogCreateOrEdit: false,
      id: null,
      name_role: null,
      headers: [
        {
          text: "Name Role",
          align: "center",
          value: "name_role",
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
    const storeRole = roleStore();
    return {
      storeRole,
    };
  },

  watch: {
    async messageRole() {
      if (this.messageRole) {
        this.$toastr.remove();
        if (this.successRole) {
          await this.storeRole.list();
          this.cancelDelete();
          this.cancelUpdateOrCreate();
          this.$toastr.success(this.messageRole, "", this.option);
        } else {
          this.$toastr.error(this.messageRole, "", this.option);
        }
      }
      this.storeRole.$patch({ success: null, message: null });
    },
  },
  methods: {
    async handleClick() {
      this.$v.name_role.$touch();
      if (!this.$v.name_role.$error) {
        const request = {
          name_role: this.name_role,
        };

        if (this.id) {
          await this.storeRole.edit(this.id, request);
        } else {
          await this.storeRole.create(request);
        }
      }
    },

    openPopupDelete(id) {
      (this.id = id), (this.isOpenDialogDelete = true);
    },

    async openPopupCreateOrEdit(id = null, item = null) {
      if (id) {
        this.id = id;
      }
      if (item) {
        this.name_role = item.name_role;
      }
      this.isOpenDialogCreateOrEdit = true;
    },

    cancelDelete() {
      (this.id = null), (this.isOpenDialogDelete = false);
    },

    cancelUpdateOrCreate() {
      (this.id = null),
        (this.name_role = null),
        (this.isOpenDialogCreateOrEdit = false);
      this.$v.name_role.$reset();
    },

    async fetch() {
      await this.storeRole.list();
    },

    async handleDelete() {
      await this.storeRole.delete(this.id);
    },
  },
  computed: {
    ...mapState(roleStore, {
      successRole: "success",
      loadingRole: "loading",
      dataRole: "data",
      messageRole: "message",
    }),

    roleErrors() {
      const errors = [];
      if (!this.$v.name_role.$dirty) return errors;
      !this.$v.name_role.required && errors.push("Role is required");
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

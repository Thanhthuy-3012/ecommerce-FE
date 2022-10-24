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
        :items="data[0]?.categories"
        :search="search"
        class="elevation-1"
        :items-per-page="10"
        :loading="loading"
        :loading-text="messageLoading"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex" style="justify-content: center">
            <v-icon class="mr-3" color="primary" :disabled="loading" @click="redirectShop(item.id)"
              >mdi-eye
            </v-icon>

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
              Are you sure delete category?
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
              {{ this.id ? "Update Category" : "Create Category" }}
            </v-card-title>
            <div class="form-create-edit">
              <v-text-field
                v-model="dataDetail.name_category"
                :error-messages="categoryNameErrors"
                @input="$v.dataDetail.name_category.$touch()"
                @blur="$v.dataDetail.name_category.$touch()"
                label="Category Name"
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
import { categoryStore } from "@/store/shop/category";
import { mapState } from "pinia";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "CategoryPage",
  mixins: [validationMixin],
  validations: {
    dataDetail: {
      name_category: {
        required,
      },
    },
  },
  data() {
    return {
      messageLoading: this.$t("label.loading"),
      search: "",
      isOpenDialogDelete: false,
      isOpenDialogCreateOrEdit: false,
      id: null,
      isOpenDialogDetail: false,
      flag_image: 0,
      dataDetail: {
        name_category: null,
      },
      defaultDetail: {
        name_category: null,
      },
      headers: [
        {
          text: "Name Category",
          align: "center",
          value: "name_category",
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
    const storeCategory = categoryStore();
    return {
      storeCategory,
    };
  },

  watch: {
    async message() {
      if (this.message) {
        this.$toastr.remove();
        if (this.success) {
          await this.storeCategory.list(this.$route.params.id);
          this.cancelDelete();
          this.cancelUpdateOrCreate();
          this.$toastr.success(this.message, "", this.option);
        } else {
          this.$toastr.error(this.message, "", this.option);
        }
      }
      this.storeCategory.$patch({ success: null, message: null });
    },
  },
  methods: {
    closeDetail() {
      this.isOpenDialogDetail = false;
    },

    async handleClick() {
      this.$v.dataDetail.$touch();
      if (!this.$v.dataDetail.$error) {
        const request = {
          name_category : this.dataDetail.name_category
        };

        if (this.id) {
          await this.storeCategory.edit(this.id, request);
        } else {
          await this.storeCategory.create(this.$route.params.id, request);
        }
      }
    },

    async openPopupCreateOrEdit(id = null, item = null) {
      if (id) {
        this.id = id;
      }
      if (item) {
        this.dataDetail = { ...item };
        this.image_url = item.image_shop;
      }
      this.isOpenDialogCreateOrEdit = true;
    },

    redirectShop(categoryId) {
      this.$router.push({ name: 'ProductPage', params: { id: this.$route.params.id}, query: { categoryId: categoryId} })
    },

    openPopupDelete(id) {
      (this.id = id), (this.isOpenDialogDelete = true);
    },

    cancelDelete() {
      (this.id = null), (this.isOpenDialogDelete = false);
    },

    async fetch() {
      await this.storeCategory.list(this.$route.params.id);
    },

    async handleDelete() {
      await this.storeCategory.delete(this.id);
    },

    cancelUpdateOrCreate() {
      (this.id = null),
        (this.dataDetail = {... this.defaultDetail}),
        (this.isOpenDialogCreateOrEdit = false);
      this.$v.dataDetail.$reset();
    },
  },
  computed: {
    ...mapState(categoryStore, {
      success: "success",
      loading: "loading",
      data: "data",
      message: "message",
    }),

    categoryNameErrors() {
      const errors = [];
      if (!this.$v.dataDetail.name_category.$dirty) return errors;
      !this.$v.dataDetail.name_category.required &&
        errors.push("Category Name is required");
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

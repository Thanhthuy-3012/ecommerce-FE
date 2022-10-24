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
        <template v-slot:[`item.image_shop`]="{ item }">
          <v-img
            :src="
              item.image_shop
                ? item.image_shop
                : require('@/assets/images/no_image.jpg')
            "
            aspect-ratio="1.7"
          ></v-img>
        </template>
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
              Are you sure delete shop?
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
              {{ this.id ? "Update Shop" : "Create Shop" }}
            </v-card-title>
            <div class="form-create-edit">
              <v-text-field
                v-model="dataDetail.name_shop"
                :error-messages="shopNameErrors"
                @input="$v.dataDetail.name_shop.$touch()"
                @blur="$v.dataDetail.name_shop.$touch()"
                label="Shop Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="dataDetail.email_shop"
                :error-messages="emailErrors"
                @input="$v.dataDetail.email_shop.$touch()"
                @blur="$v.dataDetail.email_shop.$touch()"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                type="number"
                v-model="dataDetail.phone_number"
                :error-messages="phoneErrors"
                @input="$v.dataDetail.phone_number.$touch()"
                @blur="$v.dataDetail.phone_number.$touch()"
                label="Phone Number"
                required
              ></v-text-field>
              <v-text-field
                v-model="dataDetail.address"
                :error-messages="addressErrors"
                @input="$v.dataDetail.address.$touch()"
                @blur="$v.dataDetail.address.$touch()"
                label="Address"
                required
              ></v-text-field>
              <v-img
                :src="
                  image_url
                    ? image_url
                    : require('@/assets/images/no_image.jpg')
                "
                aspect-ratio="1.7"
              ></v-img>
              <v-file-input
                v-model="dataDetail.image_shop"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image"
                prepend-icon="mdi-camera"
                label="Image Shop"
                @change="onFileChangeImg"
              ></v-file-input>
              <v-textarea
                v-model="dataDetail.description"
                :error-messages="descriptionErrors"
                @input="$v.dataDetail.description.$touch()"
                @blur="$v.dataDetail.description.$touch()"
                label="Description"
                required
              ></v-textarea>
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
import { shopStore } from "@/store/shop/shop";
import { mapState } from "pinia";
import { required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "ShopPage",
  mixins: [validationMixin],
  validations: {
    dataDetail: {
      name_shop: {
        required,
      },
      phone_number: {
        required,
      },
      address: {
        required,
      },
      description: {
        required,
      },
      email_shop: {
        required,
        email,
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
        name_shop: null,
        email_shop: null,
        phone_number: null,
        address: null,
        image_shop: null,
        description: null,
      },
      defaultDetail: {
        name_shop: null,
        email_shop: null,
        phone_number: null,
        address: null,
        image_shop: null,
        description: null,
      },
      image_url: null,
      headers: [
        {
          text: "Name Shop",
          align: "center",
          value: "name_shop",
        },
        {
          text: "Email Shop",
          align: "center",
          value: "email_shop",
        },
        {
          text: "Address",
          align: "center",
          value: "address",
        },
        {
          text: "Phone Number",
          align: "center",
          value: "phone_number",
        },
        {
          text: "Image",
          align: "center",
          value: "image_shop",
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
    const storeShop = shopStore();
    return {
      storeShop,
    };
  },

  watch: {

    async message() {
      if (this.message) {
        this.$toastr.remove();
        if (this.success) {
          await this.storeShop.list();
          this.cancelDelete();
          this.cancelUpdateOrCreate();
          this.$toastr.success(this.message, "", this.option);
        } else {
          this.$toastr.error(this.message, "", this.option);
        }
      }
      this.storeShop.$patch({ success: null, message: null });
    },
  },
  methods: {
    closeDetail() {
      this.isOpenDialogDetail = false;
    },

    redirectShop(id) {
      this.$router.push({ name: 'ShopDashboardPage', params: { id: id} })
    },

    async handleClick() {
      this.$v.dataDetail.$touch();
      if (!this.$v.dataDetail.$error) {
        const formData = new FormData();

        formData.append("name_shop", this.dataDetail.name_shop);
        formData.append("address", this.dataDetail.address);
        formData.append("phone_number", this.dataDetail.phone_number);
        formData.append("email_shop", this.dataDetail.email_shop);
        formData.append("flag_image", this.flag_image);
        formData.append("image", this.dataDetail.image_shop);
        formData.append("description", this.dataDetail.description);

        if (this.id) {
          await this.storeShop.edit(this.id, formData);
        } else {
          await this.storeShop.create(formData);
        }
      }
    },

    onFileChangeImg(e) {
      this.flag_image = 1;
      if (e == null) {
        this.image_url = null;
        this.dataDetail.image_shop = null;
      } else {
        if (e.size / 1024 / 1024 > 10) {
          this.$toastr.error(
            "The maximum file size that can be uploaded is 10MB.",
            "",
            this.option
          );
        } else {
          this.dataDetail.image_shop = e;
          this.image_url = URL.createObjectURL(this.dataDetail.image_shop);
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

    openPopupDelete(id) {
      (this.id = id), (this.isOpenDialogDelete = true);
    },

    cancelDelete() {
      (this.id = null), (this.isOpenDialogDelete = false);
    },

    async fetch() {
      await this.storeShop.list();
    },

    async handleDelete() {
      await this.storeShop.delete(this.id);
    },

    cancelUpdateOrCreate() {
      (this.id = null),
        (this.dataDetail = {... this.defaultDetail}),
        (this.isOpenDialogCreateOrEdit = false);
      this.image_url = null;
      this.flag_image = 0;
      this.$v.dataDetail.$reset();
    },
  },
  computed: {
    ...mapState(shopStore, {
      success: "success",
      loading: "loading",
      data: "data",
      message: "message",
    }),

    emailErrors() {
      const errors = [];
      if (!this.$v.dataDetail.email_shop.$dirty) return errors;
      !this.$v.dataDetail.email_shop.email &&
        errors.push("Email invalid fomart");
      !this.$v.dataDetail.email_shop.required &&
        errors.push("Email is required");
      return errors;
    },

    shopNameErrors() {
      const errors = [];
      if (!this.$v.dataDetail.name_shop.$dirty) return errors;
      !this.$v.dataDetail.name_shop.required &&
        errors.push("Shop Name is required");
      return errors;
    },

    phoneErrors() {
      const errors = [];
      if (!this.$v.dataDetail.phone_number.$dirty) return errors;
      !this.$v.dataDetail.phone_number.required &&
        errors.push("Phone Number is required");
      return errors;
    },

    addressErrors() {
      const errors = [];
      if (!this.$v.dataDetail.address.$dirty) return errors;
      !this.$v.dataDetail.address.required &&
        errors.push("Address is required");
      return errors;
    },

    descriptionErrors() {
      const errors = [];
      if (!this.$v.dataDetail.description.$dirty) return errors;
      !this.$v.dataDetail.description.required &&
        errors.push("Description is required");
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

<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="user-page">
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
            <v-icon
              class="mr-3"
              color="primary"
              @click="openPopupDetail(item)"
              :disabled="loading"
              >mdi-eye
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

      <!-- Dialog Detail -->
      <div class="text-center">
        <v-dialog v-model="isOpenDialogDetail" width="500" v-if="dataDetail">
          <v-card>
            <v-card-title class="text-h5"> Detail Shop </v-card-title>
            <div class="form-create-edit">
              <v-text-field
                v-model="dataDetail.name_shop"
                disabled
                outlined
                label="Name Shop"
              ></v-text-field>
              <v-text-field
                v-model="dataDetail.email_shop"
                disabled
                outlined
                label="Email Shop"
              ></v-text-field>
              <v-text-field
                v-model="dataDetail.address"
                disabled
                outlined
                label="Address"
              ></v-text-field>
              <v-text-field
                v-model="dataDetail.phone_number"
                disabled
                outlined
                label="Phone Number"
              ></v-text-field>
              <v-img
                :src="
                  dataDetail.image_shop
                    ? dataDetail.image_shop
                    : require('@/assets/images/no_image.jpg')
                "
                aspect-ratio="1.7"
              ></v-img>

              <v-textarea
                outlined
                name="input-7-1"
                label="Description"
                :value="dataDetail.description"
                disabled
              ></v-textarea>
            </div>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="gray darken-1" text @click="closeDetail">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import { shopStore } from "@/store/admin/shop";
import { mapState } from "pinia";

export default {
  name: "ShopPage",
  data() {
    return {
      messageLoading: this.$t("label.loading"),
      search: "",
      isOpenDialogDelete: false,
      id: null,
      isOpenDialogDetail: false,
      dataDetail: null,
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

    async openPopupDetail(item = null) {
      if (item) {
        this.dataDetail = { ...item };
      }
      this.isOpenDialogDetail = true;
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
  },
  computed: {
    ...mapState(shopStore, {
      success: "success",
      loading: "loading",
      data: "data",
      message: "message",
    }),
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

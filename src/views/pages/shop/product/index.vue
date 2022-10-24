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
        :items="products"
        :search="search"
        class="elevation-1"
        :items-per-page="10"
        :loading="loading"
        :loading-text="messageLoading"
      >
        <template v-slot:[`item.image_product`]="{ item }">
          <v-img
            :src="
              item.image_product
                ? item.image_product
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
              Are you sure delete product?
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
              {{ this.id ? "Update Product" : "Create Product" }}
            </v-card-title>
            <div class="form-create-edit">
              <v-text-field
                v-model="dataDetail.name"
                :error-messages="productNameErrors"
                @input="$v.dataDetail.name.$touch()"
                @blur="$v.dataDetail.name.$touch()"
                label="Product Name"
                required
              ></v-text-field>
              <v-select
                v-model="dataDetail.category_id"
                :items="dataCategory[0]?.categories"
                :error-messages="categoryErrors"
                @input="$v.dataDetail.category_id.$touch()"
                @blur="$v.dataDetail.category_id.$touch()"
                item-text="name_category"
                item-value="id"
                label="Category"
                required
              ></v-select>
              <v-img
                :src="
                  image_url
                    ? image_url
                    : require('@/assets/images/no_image.jpg')
                "
                aspect-ratio="1.7"
              ></v-img>
              <v-file-input
                ref="inputFileImage"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image"
                prepend-icon="mdi-camera"
                label="Image Product"
                @change="onFileChangeImgProduct"
              ></v-file-input>
              <v-textarea
                v-model="dataDetail.content"
                :error-messages="contentErrors"
                @input="$v.dataDetail.content.$touch()"
                @blur="$v.dataDetail.content.$touch()"
                label="Content"
                required
              ></v-textarea>
              <v-text-field
                type="number"
                v-model="dataDetail.price"
                :error-messages="priceErrors"
                @input="$v.dataDetail.price.$touch()"
                @blur="$v.dataDetail.price.$touch()"
                label="Price"
                required
              ></v-text-field>
              <v-text-field
                type="number"
                v-model="dataDetail.discount"
                label="Discount"
              ></v-text-field>
              <div style="position: relative">
                <v-icon
                  v-if="image_url1"
                  @click="deleteImage(1)"
                  style="position: absolute; top: 0; z-index: 99999999; left: 0"
                  >mdi-close-circle-outline</v-icon
                >
                <v-img
                  :src="
                    image_url1
                      ? image_url1
                      : require('@/assets/images/no_image.jpg')
                  "
                  aspect-ratio="1.7"
                  max-height="150"
                  max-width="250"
                ></v-img>
              </div>
              <v-file-input
                ref="inputFileImage1"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image pr"
                prepend-icon="mdi-camera"
                label="Image PR 1"
                @change="onFileChangeImg($event, 1)"
              ></v-file-input>
              <div style="position: relative">
                <v-icon
                  v-if="image_url2"
                  @click="deleteImage(2)"
                  style="position: absolute; top: 0; z-index: 99999999; left: 0"
                  >mdi-close-circle-outline</v-icon
                >
                <v-img
                  :src="
                    image_url2
                      ? image_url2
                      : require('@/assets/images/no_image.jpg')
                  "
                  aspect-ratio="1.7"
                  max-height="150"
                  max-width="250"
                ></v-img>
              </div>
              <v-file-input
                ref="inputFileImage2"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image pr"
                prepend-icon="mdi-camera"
                label="Image PR 2"
                @change="onFileChangeImg($event, 2)"
              ></v-file-input>
              <div style="position: relative">
                <v-icon
                  v-if="image_url3"
                  @click="deleteImage(3)"
                  style="position: absolute; top: 0; z-index: 99999999; left: 0"
                  >mdi-close-circle-outline</v-icon
                >
                <v-img
                  :src="
                    image_url3
                      ? image_url3
                      : require('@/assets/images/no_image.jpg')
                  "
                  aspect-ratio="1.7"
                  max-height="150"
                  max-width="250"
                ></v-img>
              </div>
              <v-file-input
                ref="inputFileImage3"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image pr"
                prepend-icon="mdi-camera"
                label="Image PR 3"
                @change="onFileChangeImg($event, 3)"
              ></v-file-input>
              <div style="position: relative">
                <v-icon
                  v-if="image_url4"
                  @click="deleteImage(4)"
                  style="position: absolute; top: 0; z-index: 99999999; left: 0"
                  >mdi-close-circle-outline</v-icon
                >
                <v-img
                  :src="
                    image_url4
                      ? image_url4
                      : require('@/assets/images/no_image.jpg')
                  "
                  aspect-ratio="1.7"
                  max-height="150"
                  max-width="250"
                ></v-img>
              </div>
              <v-file-input
                ref="inputFileImage4"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image pr"
                prepend-icon="mdi-camera"
                label="Image PR 4"
                @change="onFileChangeImg($event, 4)"
              ></v-file-input>
              <div style="position: relative">
                <v-icon
                  v-if="image_url5"
                  @click="deleteImage(5)"
                  style="position: absolute; top: 0; z-index: 99999999; left: 0"
                  >mdi-close-circle-outline</v-icon
                >
                <v-img
                  :src="
                    image_url5
                      ? image_url5
                      : require('@/assets/images/no_image.jpg')
                  "
                  aspect-ratio="1.7"
                  max-height="150"
                  max-width="250"
                ></v-img>
              </div>
              <v-file-input
                ref="inputFileImage5"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image pr"
                prepend-icon="mdi-camera"
                label="Image PR 5"
                @change="onFileChangeImg($event, 5)"
              ></v-file-input>
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
import { productStore } from "@/store/shop/product";
import { categoryStore } from "@/store/shop/category";
import { mapState } from "pinia";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "ProductPage",
  mixins: [validationMixin],
  validations: {
    dataDetail: {
      name: {
        required,
      },
      price: {
        required,
      },
      category_id: {
        required,
      },
      content: {
        required,
      },
    },
  },
  data() {
    return {
      products : [],
      messageLoading: this.$t("label.loading"),
      search: "",
      isOpenDialogDelete: false,
      isOpenDialogCreateOrEdit: false,
      id: null,
      isOpenDialogDetail: false,
      flag_image_product: 0,
      flag_image1: 0,
      flag_image2: 0,
      flag_image3: 0,
      flag_image4: 0,
      flag_image5: 0,
      dataDetail: {
        category_id: null,
        name: null,
        image_product: null,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        discount: null,
        content: null,
        price: null,
      },
      defaultDetail: {
        category_id: null,
        name: null,
        image_product: null,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        discount: null,
        content: null,
        price: null,
      },
      image_url: null,
      image_url1: null,
      image_url3: null,
      image_url2: null,
      image_url4: null,
      image_url5: null,
      headers: [
        {
          text: "Name Product",
          align: "center",
          value: "name",
        },
        {
          text: "Category",
          align: "center",
          value: "category_name",
        },
        {
          text: "Content",
          align: "center",
          value: "content",
        },
        {
          text: "Price",
          align: "center",
          value: "price",
        },
        {
          text: "Discount",
          align: "center",
          value: "discount",
        },
        {
          text: "Image",
          align: "center",
          value: "image_product",
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
    const storeProduct = productStore();
    const storeCategory = categoryStore();
    return {
      storeProduct,
      storeCategory,
    };
  },

  watch: {
    async message() {
      if (this.message) {
        this.$toastr.remove();
        if (this.success) {
          if (this.$route.query.categoryId)
          {
            await this.storeProduct.listByCategory(this.$route.query.categoryId);
          } else {
            await this.storeProduct.listByShop(this.$route.params.id); 
          }
          this.cancelDelete();
          this.cancelUpdateOrCreate();
          this.$toastr.success(this.message, "", this.option);
        } else {
          this.$toastr.error(this.message, "", this.option);
        }
      }
      this.storeProduct.$patch({ success: null, message: null });
    },

    async '$route'() {
      if (this.$route.query.categoryId)
      {
        await this.storeProduct.listByCategory(this.$route.query.categoryId);
      } else {
        await this.storeProduct.listByShop(this.$route.params.id); 
      }
      this.setProducts()
    },
  },
  methods: {
    setProducts() {
      this.data.map(e => {
        const item = {...e , category_name: e.category.name_category}
        this.products.push(item)
      })
    },

    closeDetail() {
      this.isOpenDialogDetail = false;
    },

    async handleClick() {
      this.$v.dataDetail.$touch();
      if (!this.$v.dataDetail.$error) {
        const formData = new FormData();

        formData.append("name", this.dataDetail.name);
        formData.append("category_id", this.dataDetail.category_id);
        formData.append("content", this.dataDetail.content);
        formData.append("price", this.dataDetail.price);
        formData.append("flag_image_product", this.flag_image_product);
        formData.append("flag_image1", this.flag_image1);
        formData.append("flag_image2", this.flag_image2);
        formData.append("flag_image3", this.flag_image3);
        formData.append("flag_image4", this.flag_image4);
        formData.append("flag_image5", this.flag_image5);
        if (this.flag_image_product == 1) {
          formData.append("image_product", this.dataDetail.image_product);
        }
        for (let i = 1; i <= 5; i++) {
          if (this["flag_image" + i] == 1) {
            formData.append("image" + i, this.dataDetail["image" + i]);
          }
        }
        if (this.dataDetail.discount) {
          formData.append("discount", this.dataDetail.discount);
        }

        if (this.id) {
          await this.storeProduct.edit(this.id, formData);
        } else {
          await this.storeProduct.create(formData);
        }
      }
    },

    onFileChangeImg(e, i) {
      this["flag_image" + i] = 1;
      if (e == null) {
        this["image_url" + i] = null;
        this.dataDetail["image" + i] = null;
      } else {
        if (e.size / 1024 / 1024 > 10) {
          this.$toastr.error(
            "The maximum file size that can be uploaded is 10MB.",
            "",
            this.option
          );
        } else {
          this.dataDetail["image" + i] = e;
          this["image_url" + i] = URL.createObjectURL(
            this.dataDetail["image" + i]
          );
        }
      }
    },

    onFileChangeImgProduct(e) {
      this.flag_image_product = 1;
      if (e == null) {
        this.image_url = null;
        this.dataDetail.image_product = null;
      } else {
        if (e.size / 1024 / 1024 > 10) {
          this.$toastr.error(
            "The maximum file size that can be uploaded is 10MB.",
            "",
            this.option
          );
        } else {
          this.dataDetail.image_product = e;
          this.image_url = URL.createObjectURL(this.dataDetail.image_product);
        }
      }
    },

    async openPopupCreateOrEdit(id = null, item = null) {
      if (id) {
        this.id = id;
      }
      if (item) {
        this.dataDetail = { ...item };
        this.image_url = item.image_product;
        if (item.image_p_r.length > 0) {
          item.image_p_r.forEach((imagePr) => {
            this["image_url" + imagePr.sort_no] = imagePr.image;
          });
        }
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
      if (this.$route.query.categoryId)
      {
        await this.storeProduct.listByCategory(this.$route.query.categoryId);
      } else {
        await this.storeProduct.listByShop(this.$route.params.id); 
      }
      this.setProducts()
      await this.storeCategory.list(this.$route.params.id);
    },

    async handleDelete() {
      await this.storeProduct.delete(this.id);
    },

    cancelUpdateOrCreate() {
      this.$refs.inputFileImage.reset();
      this.$refs.inputFileImage1.reset();
      this.$refs.inputFileImage2.reset();
      this.$refs.inputFileImage3.reset();
      this.$refs.inputFileImage4.reset();
      this.$refs.inputFileImage5.reset();
      (this.id = null),
        (this.dataDetail = { ...this.defaultDetail }),
        (this.isOpenDialogCreateOrEdit = false);
      this.image_url = null;
      this.image_url1 = null;
      this.image_url2 = null;
      this.image_url3 = null;
      this.image_url4 = null;
      this.image_url5 = null;
      this.flag_image1 = 0;
      this.flag_image2 = 0;
      this.flag_image3 = 0;
      this.flag_image4 = 0;
      this.flag_image5 = 0;
      this.flag_image_product = 0;
      this.$v.dataDetail.$reset();
    },

    deleteImage(i)
    {
      this.$refs["inputFileImage" + i].reset();
      this["image_url" + i] = null;
      this.dataDetail["image" + i] = null;
    }
  },
  computed: {
    ...mapState(productStore, {
      success: "success",
      loading: "loading",
      data: "data",
      message: "message",
    }),
    ...mapState(categoryStore, {
      successCategory: "success",
      loadingCategory: "loading",
      dataCategory: "data",
      messageCategory: "message",
    }),

    productNameErrors() {
      const errors = [];
      if (!this.$v.dataDetail.name.$dirty) return errors;
      !this.$v.dataDetail.name.required &&
        errors.push("Product Name is required");
      return errors;
    },

    priceErrors() {
      const errors = [];
      if (!this.$v.dataDetail.price.$dirty) return errors;
      !this.$v.dataDetail.price.required && errors.push("Price is required");
      return errors;
    },

    categoryErrors() {
      const errors = [];
      if (!this.$v.dataDetail.category_id.$dirty) return errors;
      !this.$v.dataDetail.category_id.required &&
        errors.push("Category is required");
      return errors;
    },

    contentErrors() {
      const errors = [];
      if (!this.$v.dataDetail.content.$dirty) return errors;
      !this.$v.dataDetail.content.required &&
        errors.push("Content is required");
      return errors;
    },
  },

  created() {
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

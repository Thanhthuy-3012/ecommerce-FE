import { defineStore } from "pinia";
import { URLS, API } from "@/utils";

export const productStore = defineStore("storeProduct", {
  state: () => ({
    data: [],
    message: null,
    loading: false,
    success: null
  }),

  actions: {
    async listByShop(shopId) {
      this.loading = true;
      let url = `${URLS.LIST_PRODUCT_BY_SHOP}`
      url = url.replace('{shopId}', shopId);
      await API.requestServer
        .get(url)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
            this.data = data.data;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.message
        });
    },

    async listByCategory(categoryId) {
      this.loading = true;
      let url = `${URLS.LIST_PRODUCT_BY_CATEGORY}`
      url = url.replace('{categoryId}', categoryId);
      await API.requestServer
        .get(url)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
            this.data = data.data;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.message
        });
    },

    async delete(id) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.DELETE_PRODUCT}`
      url = url.replace('{id}', id);
      await API.requestServer
        .delete(url)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
          }
          this.message = data.message
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.data.message
        });
    },

    async detail(id) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.DETAIL_PRODUCT}`
      url = url.replace('{id}', id);
      await API.requestServer
        .get(url)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
          }
          this.message = data.message
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.data.message
        });
    },

    async create(request) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.CREATE_PRODUCT}`
      await API.requestServer
        .post(url, request)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
          }
          this.message = data.message
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.data.message
        });
    },

    async edit(id, request) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.UPDATE_PRODUCT}`
      url = url.replace('{id}', id);

      await API.requestServer
        .post(url, request)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
          }
          this.message = data.message
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.data.message
        });
    },
  },
});

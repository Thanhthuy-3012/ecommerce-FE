import { defineStore } from "pinia";
import { URLS, API } from "@/utils";

export const categoryStore = defineStore("storeCategory", {
  state: () => ({
    data: [],
    message: null,
    loading: false,
    success: null
  }),

  actions: {
    async list(shopId) {
      this.loading = true;
      let url = `${URLS.LIST_CATEGORY}`
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

    async delete(id) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.DELETE_CATEGORY}`
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
      let url = `${URLS.DETAIL_CATEGORY}`
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

    async create(shopId, request) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.CREATE_CATEGORY}`
      url = url.replace('{shopId}', shopId)
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
      let url = `${URLS.UPDATE_CATEGORY}`
      url = url.replace('{id}', id);

      await API.requestServer
        .patch(url, request)
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

import { defineStore } from "pinia";
import { URLS, API } from "@/utils";

export const userStore = defineStore("storeUser", {
  state: () => ({
    data: [],
    message: null,
    loading: false,
    success: null,
    dataDetail: {}
  }),

  actions: {
    async list() {
      this.loading = true;
      await API.requestServer
        .get(`${URLS.ADMIN_LIST_USER}`)
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
          this.message = error.response.data.message
        });
    },

    async detail(id) {
      this.loading = true;
      let url = `${URLS.ADMIN_DETAIL_USER}`
      url = url.replace('{id}', id);
      await API.requestServer
        .get(url)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
            this.dataDetail = data.data;
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.data.message
        });
    },

    async delete(id) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.ADMIN_DELETE_USER}`
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

    async edit(id, request) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.ADMIN_EDIT_USER}`
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

    async create(request) {
      this.loading = true;
      this.success = false;
      let url = `${URLS.ADMIN_CREATE_USER}`
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

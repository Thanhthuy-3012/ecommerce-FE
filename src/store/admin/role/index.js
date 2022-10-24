import { defineStore } from "pinia";
import { URLS, API } from "@/utils";

export const roleStore = defineStore("storeRole", {
  state: () => ({
    data: [],
    message: null,
    loading: false,
    success: null,
  }),

  actions: {
    async list() {
      this.loading = true;
      await API.requestServer
        .get(`${URLS.ADMIN_LIST_ROLE}`)
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
      let url = `${URLS.ADMIN_DELETE_ROLE}`
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
      let url = `${URLS.ADMIN_EDIT_ROLE}`
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
      let url = `${URLS.ADMIN_CREATE_ROLE}`
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

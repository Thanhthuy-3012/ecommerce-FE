import { defineStore } from "pinia";
import { URLS, API } from "@/utils";

export const loginStore = defineStore("storeLogin", {
  state: () => ({
    data: [],
    message: null,
    loading: false,
    success: null
  }),

  actions: {
    async login(request) {
      this.loading = true;
      await API.requestServer
        .post(`${URLS.ADMIN_LOGIN}`, request)
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

    async logout() {
      this.loading = true;
      await API.requestServer
        .post(`${URLS.ADMIN_LOGOUT}`)
        .then((response) => {
          const { data } = response;
          if (data.success) {
            this.success = true
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.message = error.response.data.message
        });
    },

  },
});

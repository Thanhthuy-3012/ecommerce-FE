import { defineStore } from "pinia";
import { URLS, API } from "@/utils";

export const shopStore = defineStore("storeShop", {
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
        .get(`${URLS.ADMIN_LIST_SHOP}`)
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
      let url = `${URLS.ADMIN_DELETE_SHOP}`
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

  },
});

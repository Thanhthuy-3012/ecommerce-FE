<template>
  <v-app id="inspire" v-if="!loadingMain">
    <v-app-bar app fixed>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <div class="header-icon">
          <v-img :src="require('@/assets/logo.png')" class="my-3" />
        </div>
      </v-toolbar-title>
      <v-spacer class="d-md-block d-none"></v-spacer>
      <v-menu offset-y bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="cursor-pointer" @click="logout"
              >Logout</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app fixed>
      <div class="nav-custom">
        <v-list nav dense>
          <v-list-item-group
            v-model="selectedItem"
            color="red"
            v-if="this.$route.path !== '/'"
          >
            <v-list-item
              v-for="(item, i) in itemsShop"
              :key="i"
              :to="item.path"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>

          <v-list-item-group v-else v-model="selectedItem" color="red">
            <v-list-item v-for="(item, i) in nav" :key="i" :to="item.path">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <a v-if="this.$route.path !== '/'" href="/" class="rollback">Back to list shop</a>
    </v-navigation-drawer>
    <v-main class="bg-imge-main">
      <v-container fluid>
        <BreadCrumb />
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { loginStore } from "@/store/shop/login";
import { shopStore } from "@/store/shop/shop";
import { mapState } from "pinia";
import { CONSTANTS } from "@/utils";
export default {
  name: "DashboardLayout",
  components: {
    BreadCrumb: () => import("@/components/Breadcrumbs/index.vue"),
  },
  data() {
    return {
      loadingMain: true,
      selectedItem: 0,
      nav: [
        {
          text: "List shop",
          icon: "mdi-view-dashboard",
          path: "/",
        },
      ],
      itemsShop: [],
      drawer: null,
    };
  },
  setup() {
    const storeLogin = loginStore();
    const storeShop = shopStore();
    return {
      storeLogin,
      storeShop,
    };
  },

  watch: {
    $route() {
      this.loadingMain = true;
      if (this.$route.params.id && this.$route.path !== "/") {
        this.fetch();
      }

      this.itemsShop = [
        {
          text: "Dashboard",
          icon: "mdi-view-dashboard",
          path: "/shop/" + this.$route.params.id + "/dashboard",
        },
        {
          text: "Categories",
          icon: "mdi-view-dashboard",
          path: "/shop/" + this.$route.params.id + "/category",
        },
        {
          text: "Products",
          icon: "mdi-view-dashboard",
          path: "/shop/" + this.$route.params.id + "/product",
        },
      ];
      this.loadingMain = false;
    },
  },
  computed: {
    ...mapState(loginStore, ["success"]),
    ...mapState(shopStore, {
      status: "success",
      loading: "loading",
      data: "data",
      message: "message",
    }),
  },
  methods: {
    async fetch() {
      await this.storeShop.detail(this.$route.params.id);
      if (!this.status) {
        this.$router.push({
          name: "404",
        });
      } else {
        this.loadingMain = false;
      }
    },

    async logout() {
      await this.storeLogin.logout();
      if (this.success) {
        localStorage.removeItem(CONSTANTS.TOKEN);
        localStorage.removeItem("isAdmin");
        this.$router.push({
          name: "ShopLogin",
        });
      }
    },
  },

  async created() {
    if (this.$route.params.id && this.$route.path !== "/") {
      await this.fetch();
    }
    this.itemsShop = [
      {
        text: "Dashboard",
        icon: "mdi-view-dashboard",
        path: "/shop/" + this.$route.params.id + "/dashboard",
      },
      {
        text: "Categories",
        icon: "mdi-view-dashboard",
        path: "/shop/" + this.$route.params.id + "/category",
      },
      {
        text: "Products",
        icon: "mdi-view-dashboard",
        path: "/shop/" + this.$route.params.id + "/product",
      },
    ];
    this.loadingMain = false;
  },
};
</script>

<style lang="scss" scoped>
body {
  .rollback {
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: 14px;
  }
  .pg-container {
    padding: 0 24px;
  }
  .cursor-pointer {
    cursor: pointer;
  }

  header {
    z-index: 10 !important;

    &.v-app-bar {
      left: 0 !important;
    }

    .header-icon {
      width: 40px;
    }
  }

  nav {
    &.v-navigation-drawer {
      .nav-custom {
        margin-top: 65px;

        .v-list {
          .v-list-item {
            &__title {
              font-size: 1rem;
              font-weight: 400;
              line-height: 19px;
            }

            &__text {
              small {
                font-size: 14px;
                font-weight: 400;
                color: #00000099;
              }

              p {
                font-weight: 400;
                color: #000000de;
              }
            }
          }
        }
      }
    }
  }
}
</style>

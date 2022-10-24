import Vue from "vue";
import VueRouter from "vue-router";
import { authRouter } from "@/utils";
import DashboardPage from "../views/pages/admin/dashboard/index.vue";
import AdminUser from "../views/pages/admin/user/index.vue";
import AdminRole from "../views/pages/admin/role/index.vue";
import AdminShop from "../views/pages/admin/shop/index.vue";
import AdminLogin from "../views/pages/admin/login/index.vue";
import ShopLogin from "../views/pages/shop/login/index.vue";
import ShopPage from "../views/pages/shop/shop/index.vue";
import ShopDashboardPage from "../views/pages/shop/dashboard/index.vue";
import CategoryPage from "../views/pages/shop/category/index.vue";
import ProductPage from "../views/pages/shop/product/index.vue";
import Page404 from "../components/404/index.vue";
import i18n from "@/i18n";

Vue.use(VueRouter);

const routes = [  
  {
    path: "*",
    name: "404",
    component: Page404,
    meta: {
      title: i18n.t("nav.not_found"),
      layout: "base-layout",
    },
  },

  // Admin
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: {
      title: i18n.t("nav.dashboard"),
      layout: "dashboard-layout",
      requiresAuth: true,
      breadCrumb: [
        {
          text: i18n.t("nav.dashboard"),
        },
      ],
    },
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: {
      title: i18n.t("label.login"),
      layout: "base-layout",
    },
  },
  {
    path: "/admin/user",
    name: "Users",
    component: AdminUser,
    meta: {
      title: "User",
      requiresAuth: true,
      layout: "dashboard-layout",
      breadCrumb: [
        {
          text: "List user",
        },
      ],
    },
  },
  {
    path: "/admin/role",
    name: "Role",
    component: AdminRole,
    meta: {
      title: "Role",
      requiresAuth: true,
      layout: "dashboard-layout",
      breadCrumb: [
        {
          text: "List role",
        },
      ],
    },
  },
  {
    path: "/admin/shop",
    name: "Shop",
    component: AdminShop,
    meta: {
      title: "Shop",
      requiresAuth: true,
      layout: "dashboard-layout",
      breadCrumb: [
        {
          text: "List shop",
        },
      ],
    },
  },

  // Shop
  {
    path: "/login",
    name: "ShopLogin",
    component: ShopLogin,
    meta: {
      title: "Shop",
      layout: "shop-base-layout",
    },
  },
  {
    path: "/",
    name: "Shop",
    component: ShopPage,
    meta: {
      title: "Shop",
      requiresAuth: true,
      layout: "shop-dashboard-layout",
    },
  },
  {
    path: "/shop/:id/dashboard",
    name: "ShopDashboardPage",
    component: ShopDashboardPage,
    meta: {
      title: "Dashboard",
      requiresAuth: true,
      layout: "shop-dashboard-layout",
    },
  },
  {
    path: "/shop/:id/category",
    name: "CategoryPage",
    component: CategoryPage,
    meta: {
      title: "Category",
      requiresAuth: true,
      layout: "shop-dashboard-layout",
    },
  },
  {
    path: "/shop/:id/product",
    name: "ProductPage",
    component: ProductPage,
    meta: {
      title: "Product",
      requiresAuth: true,
      layout: "shop-dashboard-layout",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

const removeToken = () => {
  window.localStorage.removeItem('isAdmin');
  window.localStorage.removeItem('token');
}

const DEFAULT_TITLE = "Admin";
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

router.beforeEach(async (to, from, next) => {
  const { isAuth, isAdmin } = authRouter();

  if (to.path.includes("/admin")) {
    if (to.path !== "/admin/login" && isAuth && isAdmin != 1) {
      removeToken()
      next("/admin/login");
      return;
    }
    if (to.path === "/admin/login" && isAuth && isAdmin == 1) {

      next("/admin/dashboard");
      return;
    } else if ((to.matched.some((record) => record.meta.requiresAuth) && !isAuth) || isAdmin != 1) {
      
      if (to.path === "/admin/login") 
      {
        removeToken()
        next();
        return;
      }
      removeToken()
      next("/admin/login");
      return;
    }
    next();
  } else {
    if (to.path !== "/login" && isAuth && isAdmin == 1) {
      removeToken()
      next("/login");
      return;
    }
    if (to.path === "/login" && isAuth && isAdmin != 1) {
      next("/");
      return;
    } else if ((to.matched.some((record) => record.meta.requiresAuth) && !isAuth) || isAdmin == 1) {
      if (to.path === "/login") 
      {
        removeToken()
        next();
        return;
      }
      removeToken()
      next("/login");
      return;
    }
    next();
  }
});

export default router;

export const URLS = {
  BASE_URL_SERVER: `${process.env.VUE_APP_BASE_API}`,
  ADMIN_LOGIN: '/admin/login',
  ADMIN_LOGOUT: '/admin/logout',
  ADMIN_LIST_USER: '/admin/user',
  ADMIN_DELETE_USER: '/admin/user/{id}',
  ADMIN_EDIT_USER: '/admin/user/{id}',
  ADMIN_DETAIL_USER: '/admin/user/{id}',
  ADMIN_CREATE_USER: '/admin/user/create',

  ADMIN_LIST_ROLE: '/admin/role',
  ADMIN_DELETE_ROLE: '/admin/role/{id}',
  ADMIN_EDIT_ROLE: '/admin/role/{id}',
  ADMIN_CREATE_ROLE: '/admin/role/create',

  ADMIN_LIST_SHOP: '/admin/shop',
  ADMIN_DELETE_SHOP: '/admin/shop/{id}',

  //Shop

  SHOP_LOGIN: '/shop/login',
  LIST_SHOP: '/shop',
  REGIST_SHOP: '/shop/create',
  CREATE_SHOP: '/shop/create',
  UPDATE_SHOP: '/shop/{id}',
  DETAIL_SHOP: '/shop/{id}',
  DELETE_SHOP: '/shop/{id}',

  //category
  LIST_CATEGORY: '/shop/category/{shopId}',
  CREATE_CATEGORY: '/shop/category/create/{shopId}',
  UPDATE_CATEGORY: '/shop/category/{id}',
  DETAIL_CATEGORY: '/shop/category/{id}',
  DELETE_CATEGORY: '/shop/category/{id}',
  
  //product
  LIST_PRODUCT_BY_SHOP: '/shop/{shopId}/product',
  LIST_PRODUCT_BY_CATEGORY: '/shop/category/{categoryId}/product',
  CREATE_PRODUCT: '/shop/product/create',
  UPDATE_PRODUCT: '/shop/product/{id}',
  DETAIL_PRODUCT: '/shop/product/{id}',
  DELETE_PRODUCT: '/shop/product/{id}',
};

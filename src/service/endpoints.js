const BASE_URL = process.env.API_URL;
export const LOGIN = {
  login: `${BASE_URL}security/auth`,
  logout: `${BASE_URL}security/logout`,
  changePassword: `${BASE_URL}security/changePassword`,
  company: `${BASE_URL}info/list/{domain}`,
  validToken: `${BASE_URL}security/tokenValid`,
};

export const CLIENTS = {
  list: `${BASE_URL}clients/list/`,
  create: `${BASE_URL}clients/create/`,
  update: `${BASE_URL}clients/edit/{id}`,
  changeStatus: `${BASE_URL}clients/change/status/{id}`,
};

export const EMPLOYEES = {
  list: `${BASE_URL}employees/list/`,
  create: `${BASE_URL}employees/create/`,
  update: `${BASE_URL}employees/edit/{id}`,
  changeStatus: `${BASE_URL}employees/changeStatus/{id}`,
};

export const USER = {
  list: `${BASE_URL}users/list/`,
  create: `${BASE_URL}users/create/`,
  update: `${BASE_URL}users/edit/{id}`,
  changeStatus: `${BASE_URL}users/change/status/{id}`,
};

export const BRANDS = {
  list: `${BASE_URL}car/brand/list/`,
  create: `${BASE_URL}car/brand/create/`,
  update: `${BASE_URL}car/brand/edit/{id}`,
  delete: `${BASE_URL}car/brand/delete/{id}`,
  findById: `${BASE_URL}car/brand/find/{id}`,
};

export const MODEL = {
  list: `${BASE_URL}car/model/list/`,
  create: `${BASE_URL}car/model/create/`,
  update: `${BASE_URL}car/model/edit/{id}`,
  delete: `${BASE_URL}car/model/delete/{id}`,
  findById: `${BASE_URL}car/model/find/{id}`,
};

export const TYPE = {
  list: `${BASE_URL}car/type/list/`,
  create: `${BASE_URL}car/type/create/`,
  update: `${BASE_URL}car/type/edit/{id}`,
  delete: `${BASE_URL}car/type/delete/{id}`,
  findById: `${BASE_URL}car/type/find/{id}`,
};

export const FILTER = {
  list: `${BASE_URL}search`,
};

export const CARS = {
  list: `${BASE_URL}car/list/`,
  create: `${BASE_URL}car/create/`,
  update: `${BASE_URL}car/edit/{id}`,
  changeStatus: `${BASE_URL}car/change/status/{id}`,
  findByCarId: `${BASE_URL}car/find/{id}`,
  findById: `${BASE_URL}car/find/client/{id}`,
};

export const STORE = {
  list: `${BASE_URL}store/list/`,
  create: `${BASE_URL}store/create/`,
  update: `${BASE_URL}store/edit/{id}`,
  changeStatus: `${BASE_URL}store/change/status/{id}`,
  confirm: `${BASE_URL}store/confirm/email/`,
};

export const BRANDS_PRODUCT = {
  list: `${BASE_URL}products/brand/list/`,
  create: `${BASE_URL}products/brand/create/`,
  update: `${BASE_URL}products/brand/edit/{id}`,
  delete: `${BASE_URL}products/brand/delete/{id}`,
  findById: `${BASE_URL}products/brand/find/{id}`,
};

export const PRODUCTS = {
  list: `${BASE_URL}products/list/`,
  create: `${BASE_URL}products/create/`,
  update: `${BASE_URL}products/edit/{id}`,
  addQuantity: `${BASE_URL}products/add/stock/{id}`,
  changeStatus: `${BASE_URL}products/change/status/{id}`,
  findByProductId: `${BASE_URL}products/find/{id}`,
  findById: `${BASE_URL}products/find/client/{id}`,
};

export const CATEGORY_PRODUCT = {
  list: `${BASE_URL}products/category/list/`,
  create: `${BASE_URL}products/category/create/`,
  update: `${BASE_URL}products/category/edit/{id}`,
  delete: `${BASE_URL}products/category/delete/{id}`,
  findById: `${BASE_URL}products/category/find/{id}`,
};

export const INVENTORY = {
  list: `${BASE_URL}inventory/transfer/list/`,
  cancelInventory: `${BASE_URL}inventory/transfer/cancel/{id}`,
  confirmInventory: `${BASE_URL}inventory/transfer/confirm/{id}`,
  reconFirmInventory: `${BASE_URL}inventory/transfer/reconfirm/{id}`,
  findById: `${BASE_URL}inventory/transfer/find/{id}`,
  create: `${BASE_URL}inventory/create/`,
  update: `${BASE_URL}inventory/edit/{id}`,
  changeStatus: `${BASE_URL}inventory/change/status/{id}`,
  findByInventoryId: `${BASE_URL}inventory/find/{id}`,
};

export const BATCH = {
  list: `${BASE_URL}inventory/batch/list/`,
  create: `${BASE_URL}inventory/batch/create/`,
  findByProductId: `${BASE_URL}inventory/batch/find/product/{id}`,
};

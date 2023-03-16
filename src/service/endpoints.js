const BASE_URL = process.env.API_URL;
export const LOGIN = {
  login: `${BASE_URL}security/auth`,
  logout: `${BASE_URL}security/logout`,
  changePassword: `${BASE_URL}security/changePassword`,
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
  update: `${BASE_URL}users/change/role/{id}/{idrol}`,
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

export const FILTER = {
  list: `${BASE_URL}search`,
};

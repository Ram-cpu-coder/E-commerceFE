import { apiProcessor } from "../../services/apiProcessor";
const productEp = import.meta.env.VITE_BACKEND_BASE_URL + "/products";

export const createProductApi = (productObj) => {
  return apiProcessor({
    method: "post",
    url: productEp + "/",
    isPrivate: true,
    data: productObj,
    contentType: "multipart/form-data",
  });
};
export const getAdminProductApi = (page) => {
  const query = page ? `?page=${page}` : `/admin`
  return apiProcessor({
    method: "get",
    url: `${productEp}${query}`,
    isPrivate: true,
  });
};

// acc to the pagination
export const getPublicProductApi = (page) => {
  return apiProcessor({
    method: "get",
    url: `${productEp}/active?page=${page}`,
  });
};
// all the active products
export const getActiveProductApi = () => {
  return apiProcessor({
    method: "get",
    url: `${productEp}/active-products`,
  });
};
export const getSingleProductApi = (id) => {
  return apiProcessor({
    method: "get",
    url: `${productEp}/${id}`,
  });
};
export const deleteProductApi = (_id) => {
  return apiProcessor({
    method: "delete",
    url: `${productEp}/${_id}`,
    isPrivate: true,
  });
};

export const updateProductApi = (id, updateObj) => {
  return apiProcessor({
    method: "put",
    url: productEp + `/${id}`,
    data: updateObj,
    isPrivate: true,
    contentType: "multipart/form-data",
  });
};

// update product individually apart images 
export const updateProductApiIndividually = (id, updateObj) => {
  return apiProcessor({
    method: "put",
    url: productEp + `/rating/${id}`,
    data: updateObj,
    isPrivate: true,
  });
};
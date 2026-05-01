import { toast } from "react-toastify";
import {
  createProductApi,
  deleteProductApi,
  getActiveProductApi,
  getAdminProductApi,
  getPublicProductApi,
  getSingleProductApi,
  updateProductApi,
  updateProductApiIndividually,
} from "./productAxios";
import {
  setAllActiveProducts,
  setAllAdminProducts,
  setProducts,
  setPublicProducts,
  setSelectedProduct,
} from "./productSlice";
import { createRecentActivityWithAuthenticationAction } from "../recentActivity/recentActivityAction";
// with pagination
export const getAdminProductAction = () => async (dispatch, getState) => {
  const page = getState().productInfo.productAdminPage
  const pending = getAdminProductApi(page);

  const { status, message, products } = await pending;
  dispatch(setProducts(products));
};
// with no pagination
export const getAdminProductNoPaginationAction = () => async (dispatch, getState) => {
  const pending = getAdminProductApi();

  const { status, message, products } = await pending;
  dispatch(setAllAdminProducts(products));
};

export const createProductAction = (productObj) => async (dispatch) => {
  const pending = createProductApi(productObj);
  const { status, message, newProduct } = await pending;
  if (status === "success") {
    dispatch(getAdminProductAction());

    const recentActivity = {
      action: "productAdded",
      entityId: newProduct._id,
      entityType: "product"
    }
    dispatch(createRecentActivityWithAuthenticationAction(recentActivity))
  }
  toast[status](message);
  return true;
};
// with pagination
export const getPublicProductAction = () => async (dispatch, getState) => {
  const page = getState().productInfo.productCustomerPage

  const pending = getPublicProductApi(page);
  const { status, message, products } = await pending;
  if (status === "success") {
    dispatch(setPublicProducts(products));
  }
};
// without pagination
export const getActiveProductAction = () => async (dispatch) => {
  const pending = getActiveProductApi()
  toast.promise(pending, {
    pending: "Loading..."
  })
  const { status, message, products } = await pending;

  if (status === "success") {
    dispatch(setAllActiveProducts(products))
  }
}

export const getSingleProductAction = (id) => async (dispatch) => {
  try {
    const { status, product } = await getSingleProductApi(id);
    if (status === "success") {
      dispatch(setSelectedProduct(product));
    }

  } catch (error) {
    console.log(error?.message)
  };
}

export const deleteProductAction = (_id) => async (dispatch) => {
  const { status, message, deletedProduct } = await deleteProductApi(_id);
  if (status === "success") {
    dispatch(getAdminProductAction());
    dispatch(getPublicProductAction());

    const recentActivity = {
      action: "productDeleted",
      entityId: deletedProduct._id,
      entityType: "product"
    }
    dispatch(createRecentActivityWithAuthenticationAction(recentActivity))
  }
  toast[status](message);
};

export const updateProductAction = (id, updateObj) => async (dispatch) => {
  console.log(id)
  const pending = updateProductApi(id, updateObj);
  const { status, message, updatedProduct } = await pending;
  if (status === "success") {
    dispatch(getAdminProductAction());
    dispatch(getPublicProductAction());

    const recentActivity = {
      action: "productUpdated",
      entityId: updatedProduct._id,
      entityType: "product"
    }
    dispatch(createRecentActivityWithAuthenticationAction(recentActivity))
  }
  toast[status](message);
  return "success";
};

// individual update apart images
export const updateProductActionIndividually = (id, updateObj) => async (dispatch) => {
  const pending = updateProductApiIndividually(id, updateObj);

  const { status, message } = await pending;
  if (status === "success") {
    dispatch(getAdminProductAction());
    dispatch(getPublicProductAction());
  }
  return "success";
};

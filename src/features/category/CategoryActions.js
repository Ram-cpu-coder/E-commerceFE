import { toast } from "react-toastify";
import { createCategoryApi, getAllCategoriesApi, updateCategoryApi } from "./CategoryAxios.js";
import { setCategories, setSelectedCategory } from "./categorySlice.js";

export const createCategoryAction = (formData) => async (dispatch) => {
  const pending = createCategoryApi(formData);
  const { status, message } = await pending;

  if (status === "success") {
    dispatch(getAllCategoriesAction());
  }

  toast[status](message);
  return status;
};

export const getAllCategoriesAction = () => async (dispatch) => {
  const { status, categories, message } = await getAllCategoriesApi();
  if (status == "success") {
    dispatch(setCategories(categories));
  } else {
    toast.error(message);
  }
};

export const updateCategoryAction = (id, updateObj) => async (dispatch) => {
  const pending = updateCategoryApi(id, updateObj);
  const { status, message } = await pending;

  if (status === "success") {
    dispatch(setSelectedCategory({}));
    dispatch(getAllCategoriesAction()); // optional: to refresh list
  }

  toast[status](message);
  return status;
};

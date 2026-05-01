import { apiProcessor } from "../../services/apiProcessor.js";

const categoryEP = import.meta.env.VITE_BACKEND_BASE_URL + "/category";

export const createCategoryApi = (formData) => {
  return apiProcessor({
    method: "post",
    url: categoryEP, 
    data: formData,
    isPrivate: true,
    contentType: "multipart/form-data",
  });
};

export const getAllCategoriesApi = () => {
  const apiObj = {
    method: "get",
    url: categoryEP,
    isPrivate: false,
    isRefreshToken: false,
  };
  return apiProcessor(apiObj);
};


export const updateCategoryApi = (id, updateObj) => {
  return apiProcessor({
    method: "put",
    url: `${categoryEP}/${id}`,
    data: updateObj,
    isPrivate: true,
    contentType: "multipart/form-data",
  });
};


import { apiProcessor } from "../../services/apiProcessor"
export const FEATURE_BANNER_URL =
    import.meta.env.VITE_BACKEND_BASE_URL + "/featureBanner";

const URL = FEATURE_BANNER_URL;

export const createFeatureBannerApi = (obj) => {
    return apiProcessor({
        method: "post",
        url: URL,
        data: obj,
        isPrivate: true,
        contentType: "multipart/form-data",
    })
}
export const fetchFeatureBannerApi = () => {
    return apiProcessor({
        method: "get",
        url: URL,
    })
}
export const deleteFeatureBannerApi = (id) => {
    return apiProcessor({
        method: "delete",
        url: `${URL}/${id}`,
        isPrivate: true
    })
}
export const updateFeatureBannerApi = (id, updateObj) => {
    return apiProcessor({
        method: "put",
        url: `${URL}/${id}`,
        isPrivate: true,
        data: updateObj,
        contentType: "multipart/form-data",
    })
}
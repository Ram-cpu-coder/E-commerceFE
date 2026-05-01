import { apiProcessor } from "../../services/apiProcessor"

const URL = import.meta.env.VITE_BACKEND_BASE_URL + "/history";

export const getRecommendationsApi = (data) => {
    return apiProcessor({
        method: "get",
        url: URL + "/recommendation",
        data: data
    })
}

export const createUserHistory = (data) => {
    return apiProcessor({
        method: "post",
        url: URL,
        data: data
    })
}
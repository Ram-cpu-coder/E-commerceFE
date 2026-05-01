import { apiProcessor } from "../../services/apiProcessor"

const URL = import.meta.env.VITE_BACKEND_BASE_URL + "/recentActivity"

export const createRecentActivity = (obj) => {
    return apiProcessor({
        method: "post",
        url: URL,
        data: obj
    })
}

export const createRecentActivityWithAuthentication = (obj) => {
    return apiProcessor({
        method: "post",
        url: `${URL}/recentActivity`,
        data: obj,
        isPrivate: true
    })
}

export const getAllRecentActivity = (page) => {
    return apiProcessor({
        method: "get",
        url: `${URL}?page=${page}`,
        isPrivate: true
    })
}

export const getUserRecentActivity = (id, page) => {
    return apiProcessor({
        method: "post",
        url: `${URL}/user?page=${page}`,
        isPrivate: true,
        data: { userId: id }
    })
}
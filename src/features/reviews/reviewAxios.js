import { apiProcessor } from "../../services/apiProcessor"

const URL = import.meta.env.VITE_BACKEND_BASE_URL + "/review"
export const createReviewApi = (obj) => {
    return apiProcessor({
        method: "post",
        url: URL,
        isPrivate: true,
        data: obj
    })
}
// acc to the pagination
export const getAllReviewApi = (page) => {
    return apiProcessor({
        method: "get",
        url: `${URL}/admin?page=${page}`,
        isPrivate: true
    })
}
// acc to the pagination 
export const getPubReviewApi = ({ page, productId }) => {
    const query = new URLSearchParams({ page })

    if (productId) {
        query.append("productId", productId)
    }

    return apiProcessor({
        method: "get",
        url: `${URL}?${query.toString()}`
    })
}

export const getAllPubReviewApi = () => {
    return apiProcessor({
        method: "get",
        url: `${URL}/public`
    })
}
export const updateStatusOfReviewApi = (obj) => {
    return apiProcessor({
        method: "put",
        url: URL,
        isPrivate: true,
        data: obj
    })
}
export const deleteReviewApi = (id) => {
    return apiProcessor({
        method: "delete",
        url: URL,
        isPrivate: true,
        data: { id }
    })
}
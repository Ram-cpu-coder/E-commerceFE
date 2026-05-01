import { apiProcessor } from "../../services/apiProcessor"
const orderUrl = import.meta.env.VITE_BACKEND_BASE_URL + "/orders";

export const updateOrder = (obj) => {
    return apiProcessor({
        method: "put",
        url: `${orderUrl}`,
        data: obj,
        isPrivate: true
    })
}

export const getOrder = (page) => {
    return apiProcessor({
        method: "get",
        url: `${orderUrl}?page=${page}`,
        isPrivate: true,
    })
}

// get all orders for the admin
export const getAllOrders = (page) => {
    return apiProcessor({
        method: "get",
        url: `${orderUrl}/admin?page=${page}`,
        isPrivate: true,
    })
}

// get all orders for the admin
export const getAllOrdersNoPagination = () => {
    return apiProcessor({
        method: "get",
        url: `${orderUrl}/all`,
        isPrivate: true,
    })
}

export const getAllOrdersTimeFrame = (startTime, endTime) => {
    return apiProcessor({
        method: "get",
        url: `${orderUrl}/timeFrame?startTime=${startTime}&endTime=${endTime}`,
        isPrivate: true,
    })
}

export const getAdminSalesTimeFrameApi = (startTime, endTime, granularity) => {
    return apiProcessor({
        method: "get",
        url: `${orderUrl}/report?startTime=${startTime}&endTime=${endTime}&granularity=${granularity}`,
        isPrivate: true,
    })
}

export const deleteOrderApi = (_id) => {
    return apiProcessor({
        method: "delete",
        url: orderUrl + `/${_id}/delete`,
        isPrivate: true
    })
}

export const deleteOrderItemApi = (_id, ID) => {
    return apiProcessor({
        method: "delete",
        url: orderUrl + `/${_id}/delete/${ID}`,
        isPrivate: true,
    })
}
import { toast } from "react-toastify";
import { deleteOrderApi, deleteOrderItemApi, getAdminSalesTimeFrameApi, getAllOrders, getAllOrdersNoPagination, getAllOrdersTimeFrame, getOrder, updateOrder } from "./orderAxios"
import { setOrders, setOrdersNoPagination, setSales, setTimeFramePastWeekOrders, setTimeFramePresentWeekOrders } from "./orderSlice";
import { createRecentActivity } from "../recentActivity/recentActivityAPI";
import { createRecentActivityWithAuthenticationAction } from "../recentActivity/recentActivityAction";


export const getOrderAction = () => async (dispatch, getState) => {
    const page = getState().orderInfo.orderCustomerPage
    const pending = getOrder(page);

    const { status, message, orders } = await pending;
    if (status === "success") { dispatch(setOrders(orders)) };
}

export const getAdminOrderAction = () => async (dispatch, getState) => {
    const page = getState().orderInfo.orderAdminPage
    const pending = getAllOrders(page);
    const { status, message, orders } = await pending;

    await dispatch(setOrders(orders))
    if (status === "success") {
        return true
    }
}

export const getAllOrderNoPaginationAction = () => async (dispatch, getState) => {

    const pending = getAllOrdersNoPagination();
    const { status, message, orders } = await pending;

    await dispatch(setOrdersNoPagination(orders))
    if (status === "success") {
        return true
    }
}

export const getAdminSalesTimeFrameAction = (startTime, endTime, granularity) => async (dispatch) => {

    const { status, message, sales } = await getAdminSalesTimeFrameApi(startTime, endTime, granularity);
    if (status === "success") {
        dispatch(setSales(sales))
        return true
    }
}

export const getAdminOrdersPresentWeekTimeFrameAction = (startTime, endTime) => async (dispatch) => {

    const { status, message, orders } = await getAllOrdersTimeFrame(startTime, endTime);

    await dispatch(setTimeFramePresentWeekOrders(orders))
    if (status === "success") {
        return true
    }
}

export const getAdminOrdersPastWeekTimeFrameAction = (startTime, endTime) => async (dispatch) => {

    const { status, message, orders } = await getAllOrdersTimeFrame(startTime, endTime);

    await dispatch(setTimeFramePastWeekOrders(orders))
    if (status === "success") {
        return true
    }
}

export const updateOrderAction = (updateObj) => async (dispatch) => {
    const pending = updateOrder(updateObj);
    toast.promise(pending, {
        pending: "Updating..."
    })
    const { status, message, orderUpdated } = await pending;
    console.log(orderUpdated)
    if (status === "success") {
        dispatch(getAdminOrderAction());

        const obj = {
            action: "orderUpdated",
            entityId: orderUpdated._id,
            entityType: "order"
        }
        dispatch(createRecentActivityWithAuthenticationAction(obj))
        toast[status](message);
        return true
    }
    toast[status](message);
    return false
}

export const deleteOrderAction = (_id) => async (dispatch) => {
    const pending = deleteOrderApi(_id);
    toast.promise(pending, {
        pending: "Cancelling the Order ..."
    })
    const { status, message, response, user } = await pending;
    if (status === "success") {
        user?.role === "admin" ?
            dispatch(getAdminOrderAction()) :
            dispatch(getOrderAction());

        const obj = {
            action: "orderCancelled",
            entityId: response._id,
            entityType: "order"
        }
        dispatch(createRecentActivityWithAuthenticationAction(obj))

    }
    toast[status](message);
}

export const deleteOrderItemAction = (_id, ID) => async (dispatch) => {
    const pending = deleteOrderItemApi(_id, ID);
    toast.promise(pending, {
        pending: "Deleting the Order ..."
    })
    const { status, message } = await pending;
    if (status === "success") {
        dispatch(getAdminOrderAction())
        dispatch(getOrderAction())
    }
    toast[status](message);
}

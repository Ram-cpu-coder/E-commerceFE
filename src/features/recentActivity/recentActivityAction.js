import { toast } from "react-toastify"
import { createRecentActivity, createRecentActivityWithAuthentication, getAllRecentActivity, getUserRecentActivity } from "./recentActivityAPI"
import { setRecentActivity } from "./recentActivitySlice"

export const createRecentActivityAction = (obj) => async (dispatch) => {
    try {
        const data = await createRecentActivity(obj)
        if (data.status === "success") {
            dispatch(getAllRecentActivityAction(1))
            dispatch(getUserRecentActivityAction(1))
        }
    } catch (error) {
        console.log(error?.message, "From RecentActivity Action")
    }
}

export const createRecentActivityWithAuthenticationAction = (obj) => async (dispatch) => {
    try {
        const data = await createRecentActivityWithAuthentication(obj)
        if (data.status === "success") {
            dispatch(getAllRecentActivityAction(1))
            dispatch(getUserRecentActivityAction(1))
        }

    } catch (error) {
        console.log(error?.message, "From RecentActivity Action")
    }
}

export const getAllRecentActivityAction = (page) => async (dispatch) => {
    try {
        const data = await getAllRecentActivity(page)
        if (data.status === "success") {
            dispatch(setRecentActivity(data.data))
            return data.data
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error?.message, "From RecentActivity Action")
    }
}

export const getUserRecentActivityAction = (id, page) => async (dispatch) => {
    try {
        const data = await getUserRecentActivity(id, page)
        if (data.status === "success") {
            dispatch(setRecentActivity(data.data))
            return data.data
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error?.message, "From RecentActivity Action")
    }
}
import { toast } from "react-toastify"
import { createReviewApi, deleteReviewApi, getAllPubReviewApi, getAllReviewApi, getPubReviewApi, updateStatusOfReviewApi } from "./reviewAxios"
import { setAllPubReviews, setAllReview, setPubReviews, setSelectedReview } from "./reviewSlice"

export const createReviewAction = (obj) => async (dispatch) => {
    const pending = createReviewApi(obj)
    toast.promise(pending, {
        pending: "Posting..."
    })
    const { status, message } = await pending
    toast[status](message)
    if (status === "success") {
        dispatch(getAllReviewAction())
        dispatch(getPubReviewAction())
        return true
    }
}
// acc to the pagination
export const getAllReviewAction = () => async (dispatch, getState) => {
    const page = getState().reviewInfo.reviewAdminPage
    const { status, reviews } = await getAllReviewApi(page)
    if (status === "success") {
        dispatch(setAllReview(reviews))
    }
}
// acc to the pagination 
export const getPubReviewAction = (productId) => async (dispatch, getState) => {
    const page = getState().reviewInfo.reviewCustomerPage
    const { status, reviews } = await getPubReviewApi({ page, productId })
    if (status === "success") {
        if (!productId) {
            dispatch(setPubReviews(reviews));
        } else {
            dispatch(setSelectedReview(reviews));
        }
    }
}
// all the public reviews
export const getAllPubReviewAction = () => async (dispatch) => {
    const { status, reviews } = await getAllPubReviewApi()
    if (status === "success") {
        dispatch(setAllPubReviews(reviews))
    }
}

export const updateStatusOfReviewAction = (obj) => async (dispatch) => {

    const { status, message } = await updateStatusOfReviewApi(obj)
    if (status === "success") {
        dispatch(getAllReviewAction())
    }
    toast[status](message)
}

export const deleteReviewAction = (id) => async (dispatch) => {
    const pending = deleteReviewApi(id)

    toast.promise(pending, {
        pending: "Deleting ..."
    })
    const { status, message } = await pending
    if (status === "success") {
        dispatch(getAllReviewAction())
    }
    toast[status](message)
}
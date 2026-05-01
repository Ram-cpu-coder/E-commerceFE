import { toast } from "react-toastify";
import { setWishlist } from "./wishlistSlice";
import { createWishlistApi, deleteWishlistApi, deleteWishlistItemApi, getWishlistApi } from "./wishlistAPI";

export const createWishlistAction = (obj) => async (dispatch) => {
    const pending = createWishlistApi(obj);
    toast.promise(pending, {
        pending: "Processing..."
    })
    const { status, message, data } = await pending;
    dispatch(getWishlistAction())
    toast[status](message)
}
export const getWishlistAction = () => async (dispatch) => {
    try {
        const { status, data } = await getWishlistApi();
        if (status === "success") {
            dispatch(setWishlist(data))
        }
        else {
            dispatch(setWishlist([]))
        }
    } catch (error) {
        dispatch(setWishlist([]))
    }
}

//  this one is to delete all 
export const deleteWishlistAction = () => async (dispatch) => {
    const pending = deleteWishlistApi();
    toast.promise(pending, {
        pending: "Processing..."
    })
    const { status, message } = await pending;
    if (status === "success") { dispatch(getWishlistAction()) }
    toast[status](message)
}
export const deleteWishlistItemAction = (_id) => async (dispatch) => {
    const pending = deleteWishlistItemApi(_id);
    toast.promise(pending, {
        pending: "Processing..."
    })
    const { status, message, data } = await pending;
    if (status === "success") { dispatch(getWishlistAction()) }
    toast[status](message)
    dispatch(getWishlistAction())
}

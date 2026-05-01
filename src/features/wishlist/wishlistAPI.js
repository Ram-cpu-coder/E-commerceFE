import { apiProcessor } from "../../services/apiProcessor"

const URL = import.meta.env.VITE_BACKEND_BASE_URL + "/wishlist"
// creating the wishlist 
export const createWishlistApi = (obj) => {
    return apiProcessor({
        method: "post",
        url: URL,
        isPrivate: true,
        data: obj
    })
}

// getting the user's wishlist 
export const getWishlistApi = () => {
    // it needs the userId and it will be accessible in BE 
    return apiProcessor({
        method: "get",
        url: URL,
        isPrivate: true
    })
}

// deleting the whole wishlist
export const deleteWishlistApi = () => {
    return apiProcessor({
        method: "delete",
        url: URL,
        isPrivate: true
    })
}

// deleting the wishlist item 
export const deleteWishlistItemApi = (_id) => {
    // here use the id to send through params in the url
    return apiProcessor({
        method: "delete",
        url: URL + `/${_id}`,
        isPrivate: true
    })
}
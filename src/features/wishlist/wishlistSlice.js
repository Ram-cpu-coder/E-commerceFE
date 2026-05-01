import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    wishlist: [],
}
const wishlistSlice = new createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action) => {
            state.wishlist = action.payload;
        },
        resetWishlist: (state) => {
            state.wishlist = []
        }
    }
})

export const { setWishlist, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

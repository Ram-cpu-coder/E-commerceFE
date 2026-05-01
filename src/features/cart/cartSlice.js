import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => { state.cart = action.payload },
        removeItem: (state, action) => {
            const _id = action.payload
            state.cart = state.cart.filter(item => item._id != _id)
        },
        resetCart: (state) => {
            state.cart = [];
        }
    }
})

export const { setCart, removeItem, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
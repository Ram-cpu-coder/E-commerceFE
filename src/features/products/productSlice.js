import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  products: {}, // with pagination
  allAdminProducts: [], // no pagination
  publicProducts: {},  // with pagination 
  allActiveProducts: [], // no pagination
  selectedProduct: null,
  productCustomerPage: 1,
  productAdminPage: 1
};
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, { payload }) => {
      state.products = payload;
    },
    setAllAdminProducts: (state, { payload }) => {
      state.allAdminProducts = payload;
    },
    setPublicProducts: (state, { payload }) => {
      state.publicProducts = payload;
    },
    setAllActiveProducts: (state, { payload }) => {
      state.allActiveProducts = payload;
    },
    setSelectedProduct: (state, { payload }) => {
      state.selectedProduct = payload;
    },
    setProductCustomerPage: (state, { payload }) => {
      state.productCustomerPage = payload
    },
    setProductAdminPage: (state, { payload }) => {
      state.productAdminPage = payload
    }
  },
});

export const { setProducts, setAllAdminProducts, setSelectedProduct, setPublicProducts, setAllActiveProducts, setProductCustomerPage, setProductAdminPage } = productSlice.actions;

export default productSlice.reducer;

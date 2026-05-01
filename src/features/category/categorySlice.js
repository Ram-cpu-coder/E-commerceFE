import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Categories: [],
  selectedCategory: {},
};
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload || "";
    },
    setCategories: (state, { payload }) => {
      state.Categories = payload || [];
    },
  },
});

const { reducer, actions } = categorySlice;

export const { setSelectedCategory, setCategories } = actions;
export default reducer;
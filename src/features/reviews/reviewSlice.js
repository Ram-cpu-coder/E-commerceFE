import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pubReviews: [],
  allPubReviews: [],
  allReviews: [],
  selectedReview: [],
  reviewCustomerPage: 1,
  reviewAdminPage: 1
};

const reviewslice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setPubReviews: (state, { payload }) => {
      state.pubReviews = payload || [];
    },
    setAllPubReviews: (state, { payload }) => {
      state.allPubReviews = payload || [];
    },
    setAllReview: (state, { payload }) => {
      state.allReviews = payload || [];
    },
    setSelectedReview: (state, { payload }) => {
      state.selectedReview = payload || [];
    },
    updateReviewStatus: (state, { payload }) => {
      const { _id, status } = payload;
      state.allReviews = state.allReviews.map((item) => {
        if (item._id === _id) {
          return { ...item, status };
        }
        return item;
      });
    },
    setReviewCustomerPage: (state, { payload }) => {
      state.reviewCustomerPage = payload
    },
    setReviewAdminPage: (state, { payload }) => {
      state.reviewAdminPage = payload
    }
  },
});

const { reducer, actions } = reviewslice;

export const { setPubReviews, setAllPubReviews, setAllReview, setSelectedReview, updateReviewStatus, setReviewCustomerPage, setReviewAdminPage } = actions;
export default reducer;

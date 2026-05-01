import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    featureBanner: [],
}

const featureBannerSlice = createSlice({
    name: "Feature Banner",
    initialState,
    reducers: {
        setFeatureBanner: (state, { payload }) => {
            state.featureBanner = payload || [];
        },
        resetFeatureBanner: (state) => {
            state.featureBanner = []
        },
        upsertFeatureBanner: (state, { payload }) => {
            if (!payload?._id) return;

            const index = state.featureBanner.findIndex(
                (item) => item._id === payload._id
            );

            if (index >= 0) {
                state.featureBanner[index] = payload;
            } else {
                state.featureBanner.unshift(payload);
            }
        },
    }
})

export const {
    setFeatureBanner,
    resetFeatureBanner,
    upsertFeatureBanner,
} = featureBannerSlice.actions;

export default featureBannerSlice.reducer;
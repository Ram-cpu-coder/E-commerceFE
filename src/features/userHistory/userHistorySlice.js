import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    hotPicks: []
}

const userHistorySlice = createSlice({
    name: "userHistory",
    initialState,
    reducers: {
        setHotPicks: (state, { payload }) => {
            state.hotPicks = payload || []
        }
    }
})

const { actions } = userHistorySlice;

export const { setHotPicks } = actions
export default userHistorySlice.reducer

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    recentActivity: []
}

const recentActivityslice = createSlice({
    name: "recentActivity",
    initialState,
    reducers: {
        setRecentActivity: (state, { payload }) => {
            state.recentActivity = payload
        }
    }
})

const { reducer, actions } = recentActivityslice
export const { setRecentActivity } = actions
export default reducer

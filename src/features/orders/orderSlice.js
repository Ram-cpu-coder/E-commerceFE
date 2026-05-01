import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: {},
  ordersNoPagination: [],
  timeFramePresentWeekOrders: [], // just for one week
  timeFramePastWeekOrders: [], // just for one week
  sales: [{
    totalSales: 0,
    totalRevenue: 0,
    _id: "",
  },],
  shippingAddress: "",
  orderCustomerPage: 1,
  orderAdminPage: 1
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, { payload }) => {
      state.orders = payload || [];
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setOrderAdminPage: (state, { payload }) => {
      state.orderAdminPage = payload
    },
    setOrdersNoPagination: (state, { payload }) => {
      state.ordersNoPagination = payload
    },
    setOrderCustomerPage: (state, { payload }) => {
      state.orderCustomerPage = payload
    },
    setTimeFramePresentWeekOrders: (state, { payload }) => {
      state.timeFramePresentWeekOrders = payload || []
    },
    setTimeFramePastWeekOrders: (state, { payload }) => {
      state.timeFramePastWeekOrders = payload || []
    },
    setSales: (state, { payload }) => {
      state.sales = payload || [{
        totalSales: 0,
        totalRevenue: 0,
        date: ""
      }]
    }
  },
});

const { reducer, actions } = orderSlice;

export const { setOrders, setShippingAddress, setOrderAdminPage, setOrderCustomerPage, setTimeFramePresentWeekOrders, setTimeFramePastWeekOrders, setSales, setOrdersNoPagination } = actions;
export default reducer;
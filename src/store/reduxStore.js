import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice.js";
import productReducer from "../features/products/productSlice.js";
import reviewReducer from "../features/reviews/reviewSlice.js";
import orderReducer from "../features/orders/orderSlice.js";
import categoryReducer from "../features/category/categorySlice.js"
import cartReducer from "../features/cart/cartSlice.js"
import wishlistSliceReducer from "../features/wishlist/wishlistSlice.js"
import userHistoryReducer from "../features/userHistory/userHistorySlice.js"
import featureBannerReducer from "../features/featureBanner/featureBannerSlice.js"
import recentActivityReducer from "../features/recentActivity/recentActivitySlice.js"

export default configureStore({
  reducer: {
    userInfo: userReducer,
    productInfo: productReducer,
    orderInfo: orderReducer,
    reviewInfo: reviewReducer,
    categoryInfo: categoryReducer,
    cartInfo: cartReducer,
    wishlistSliceInfo: wishlistSliceReducer,
    userHistoryInfo: userHistoryReducer,
    featureBannerInfo: featureBannerReducer,
    recentActivityInfo: recentActivityReducer
  },
});

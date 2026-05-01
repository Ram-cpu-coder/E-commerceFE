
import { getSingleProductAction } from "../features/products/productActions";
import { getPubReviewAction } from "../features/reviews/reviewAction";
import { createUserHistoryAction } from "../features/userHistory/userHistoryAction";

export const handleOnClickProduct = async (item, user, dispatch) => {
    await createUserHistoryAction({
        userId: user._id || null,
        productId: item._id,
        categoryId: item.category,
        action: "click",
    });
    await dispatch(getSingleProductAction(item._id));
    await dispatch(getPubReviewAction());
    window.location.href = `/${item._id}`;
};

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  setOrderAdminPage,
  setOrderCustomerPage,
} from "../../features/orders/orderSlice";
import { useDispatch } from "react-redux";
import {
  setProductAdminPage,
  setProductCustomerPage,
} from "../../features/products/productSlice";
import {
  setReviewAdminPage,
  setReviewCustomerPage,
} from "../../features/reviews/reviewSlice";

export default function PaginationRounded({ totalPages, page, mode, client }) {
  const dispatch = useDispatch();
  const handleOnChange = (event, value) => {
    const key = `${mode}_${client}`;

    switch (key) {
      case "order_customer":
        dispatch(setOrderCustomerPage(value));
        break;
      case "order_admin":
        dispatch(setOrderAdminPage(value));
        break;
      case "product_customer":
        dispatch(setProductCustomerPage(value));
        break;
      case "product_admin":
        dispatch(setProductAdminPage(value));
        break;
      case "review_customer":
        dispatch(setReviewCustomerPage(value));
        break;
      case "review_admin":
        dispatch(setReviewAdminPage(value));
        break;
    }
  };
  return (
    <Stack spacing={2} className="mt-3 d-flex align-items-end">
      <Pagination
        count={totalPages}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleOnChange}
      />
    </Stack>
  );
}

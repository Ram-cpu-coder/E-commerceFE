import React, { useEffect, useMemo } from "react";
import ProductReviewCard from "./ProductReviewCard";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPubReviewAction } from "../../features/reviews/reviewAction";
import PaginationRounded from "../pagination/PaginationRounded";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const ProductReviews = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const { reviewCustomerPage, selectedReview } = useSelector(
    (state) => state.reviewInfo
  );

  useEffect(() => {
    const fetchReviews = async () => {
      await dispatch(getPubReviewAction(selectedProduct._id));
    };
    fetchReviews();
  }, [dispatch, selectedProduct._id, reviewCustomerPage]);

  const reviewDocs = useMemo(() => {
    const apiReviews = selectedReview?.docs || selectedReview?.reviews || [];
    const productReviews = selectedProduct?.reviews || [];
    const reviews = apiReviews.length ? apiReviews : productReviews;

    return reviews.filter(
      (review) => String(review.productId) === String(selectedProduct._id)
    );
  }, [selectedReview, selectedProduct?._id, selectedProduct?.reviews]);

  if (!selectedReview && !selectedProduct?.reviews) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <div className="container mt-4">
      <h1 className="text-start w-100">Latest Reviews</h1>

      {!reviewDocs?.length ? (
        <div className="text-center">No Reviews yet</div>
      ) : (
        <>
          <Row className="g-4">
            {reviewDocs.map((item) => (
              <Col key={item._id} xs={12} sm={12} md={6} lg={6} xl={4}>
                <ProductReviewCard item={item} />
              </Col>
            ))}
          </Row>
          <div className="mt-2 d-flex justify-content-center w-100">
            {selectedReview.totalPages > 1 && (
              <PaginationRounded
                totalPages={selectedReview.totalPages}
                page={reviewCustomerPage}
                mode="review"
                client="customer"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews;

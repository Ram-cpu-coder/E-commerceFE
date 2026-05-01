import React, { useEffect, useState } from "react";
import { UserLayout } from "../../components/layouts/UserLayout";
import { setMenu } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ReviewsTable from "./ReviewsTable";
import { getAllReviewAction } from "../../features/reviews/reviewAction";
import useForm from "../../hooks/useForm";
import ControlBarReview from "./ControlBarReview";
import { filterFunctionReviews } from "../../utils/filterProducts";
import PaginationRounded from "../../components/pagination/PaginationRounded";
import BreadCrumbsAdmin from "../../components/breadCrumbs/BreadCrumbsAdmin";

const AdminReview = () => {
  const dispatch = useDispatch();
  const { allReviews, reviewAdminPage } = useSelector(
    (state) => state.reviewInfo
  );
  const { form, handleOnChange } = useForm({
    searchQuery: "",
    status: "all",
    others: "newest",
  });

  const [displayReviews, setDisplayReviews] = useState([]);

  useEffect(() => {
    dispatch(setMenu("Reviews"));
  }, []);

  useEffect(() => {
    const fetchAdminReviews = async () => {
      await dispatch(getAllReviewAction());
    };
    fetchAdminReviews();
  }, [reviewAdminPage]);

  useEffect(() => {
    const data = allReviews?.docs || [];
    setDisplayReviews(filterFunctionReviews(form, data));
  }, [form, allReviews]);

  return (
    <UserLayout pageTitle="Reviews">
      <BreadCrumbsAdmin />
      {/* controls */}
      <ControlBarReview
        form={form}
        handleOnChange={handleOnChange}
        allReviews={allReviews}
      />
      <hr />
      {displayReviews.length <= 0 && (
        <p className="text-center" style={{ minHeight: "80vh" }}>
          No Reviews here yet...
        </p>
      )}
      <ReviewsTable allReviews={displayReviews} />
      <div className="mt-2 d-flex justify-content-center w-100">
        <PaginationRounded
          totalPages={allReviews.totalPages}
          page={reviewAdminPage}
          mode="review"
          client="admin"
        />
      </div>
    </UserLayout>
  );
};

export default AdminReview;

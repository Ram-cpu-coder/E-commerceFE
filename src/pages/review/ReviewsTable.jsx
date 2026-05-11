import React from "react";
import ReviewRow from "./ReviewRow";

const ReviewsTable = ({ allReviews }) => {
  return (
    <div className="admin-review-table-shell table-responsive">
      <table className="table admin-review-table">
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Product</th>
            <th scope="col">User</th>
            <th scope="col">Rating</th>
            <th scope="col">Comment</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <ReviewRow allReviews={allReviews} />
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;

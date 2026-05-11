import { AiFillDelete } from "react-icons/ai";
import { IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import Stars from "../../components/rating/Stars";
import { Button, Form } from "react-bootstrap";
import {
  deleteReviewAction,
  updateStatusOfReviewAction,
} from "../../features/reviews/reviewAction";

const ReviewRow = ({ allReviews }) => {
  const dispatch = useDispatch();

  const handleOnStatusOfReview = (e) => {
    e.preventDefault();
    const { value, checked } = e.target;
    dispatch(
      updateStatusOfReviewAction({
        _id: value,
        approved: checked,
      })
    );
  };

  const handleDeleteReview = (id) => {
    dispatch(deleteReviewAction(id));
  };

  return allReviews.map((review) => {
    return (
      <tr key={review._id}>
        <td>
          <div className={`review-status-pill ${review.approved ? "approved" : "pending"}`}>
            {review.approved ? <IoCheckmarkCircleOutline aria-hidden /> : <IoTimeOutline aria-hidden />}
            <span>{review.approved ? "Approved" : "Pending"}</span>
            <Form.Check
              type="switch"
              id={`review-status-${review._id}`}
              onChange={handleOnStatusOfReview}
              value={review._id}
              label={null}
              checked={Boolean(review.approved)}
            />
          </div>
        </td>
        <td>
          <div className="review-product-cell">
            <img
              src={review.productImage || "/placeholder-image.png"}
              alt={review.productName || "Product"}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
            <div>
              <strong>{review.productName || "Unknown product"}</strong>
              <small>{review.productId}</small>
            </div>
          </div>
        </td>
        <td>
          <div className="review-user-cell">
            <img
              src={review.userImage || "/default.png"}
              alt={review.userName || "User"}
            />
            <div>
              <strong>{review.userName || "Customer"}</strong>
              <small>{review.email}</small>
            </div>
          </div>
        </td>
        <td>
          <Stars avgRating={review.rating} />
        </td>
        <td>
          <p className="review-comment">{review.comment}</p>
        </td>
        <td>
          <Button
            variant="link"
            className="review-delete-button"
            title="Delete"
            onClick={() => handleDeleteReview(review._id)}
          >
            <AiFillDelete />
          </Button>
        </td>
      </tr>
    );
  });
};

export default ReviewRow;

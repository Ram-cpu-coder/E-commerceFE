import { AiFillDelete } from "react-icons/ai";
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
      <tr key={review._id} style={{ width: "100%" }}>
        <td className="col-1">
          <img
            src={review.productImage}
            alt="Image"
            className="border"
            style={{ maxHeight: "2.5rem", maxWidth: "2.5rem" }}
          />
        </td>
        <td className="col-1">
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              onChange={handleOnStatusOfReview}
              value={review._id}
              label=""
              checked={review.approved}
            />
          </Form>
        </td>
        <td className="col-4" style={{ minWidth: "300px" }}>
          {review.productName}
        </td>
        <td className="col-2">
          <div
            className="d-flex gap-2 align-items-center flex-wrap"
            style={{ maxWidth: "300px", minWidth: "0" }}
          >
            <img
              src={review.userImage || "/default.png"}
              alt="Image"
              style={{ maxHeight: "2.5em", maxWidth: "2.5em" }}
            />
            <div
              style={{
                minWidth: 0,
                overflowWrap: "break-word",
              }}
            >
              <strong>{review.userName}</strong>
            </div>
          </div>
        </td>
        <td className="col-1">
          <Stars avgRating={review.rating} />
        </td>
        <td className="col-3">{review.comment}</td>
        <td className="col-3">
          <Button
            variant="danger"
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

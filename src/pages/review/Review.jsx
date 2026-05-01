import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { createReviewAction } from "../../features/reviews/reviewAction";

const Review = ({
  productId,
  isReviewing,
  setIsReviewing,
  handleToggleReview,
}) => {
  const [ratings, setRatings] = useState(1);
  const [comment, setComment] = useState("");

  const { user } = useSelector((state) => state.userInfo);

  const dispatch = useDispatch();

  const isOpen = String(isReviewing) === String(productId);

  // review
  const handleReview = (userId, productId, ratings, comment) => {
    const obj = {
      userId,
      productId,
      rating: ratings,
      comment,
    };
    const postReview = dispatch(createReviewAction(obj));
    if (postReview) {
      handleToggleReview(null);
    }
  };
  return (
    <div className="d-flex">
      {isOpen && (
        <div
          className="rounded shadow bg-white d-flex gap-3  justify-content-center position-absolute border"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
            // boxSizing: "border-box",
            zIndex: 9999,
          }}
        >
          {/* stars */}
          <div
            className="d-flex flex-column gap-2 w-100 position-relative"
            style={{}}
          >
            <div className="d-flex align-items-center gap-2">
              <p className="m-0 fs-4">
                <strong>Select Rating:</strong>
              </p>
              <div className="d-flex">
                {new Array(5).fill("").map((item, i) => (
                  <FaStar
                    key={i}
                    onClick={() => setRatings(i + 1)}
                    className={`${
                      i < ratings ? "text-warning" : "text-secondary"
                    } fs-2`}
                  />
                ))}
              </div>
            </div>
            <textarea
              name="comment"
              id="comment"
              className="px-2"
              placeholder="Comment Here ...."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                height: "120px",
                resize: "none",
                padding: "8px",
                fontSize: "16px",
              }}
            ></textarea>
            <Button
              onClick={() =>
                handleReview(user._id, productId, ratings, comment)
              }
            >
              Submit
            </Button>
          </div>
          <RxCross1
            className="fs-4 text-danger position-absolute"
            style={{ cursor: "pointer", top: "5px", right: "5px" }}
            title="Close"
            onClick={() => handleToggleReview(null)}
          />
        </div>
      )}
      <MdOutlineRateReview
        className={`fs-4 ${isOpen ? "text-secondary" : "text-black"}`}
        style={{ cursor: "pointer" }}
        title="Feedback"
        onClick={() => {
          handleToggleReview(productId);
          console.log(isOpen, productId);
        }}
      />
    </div>
  );
};

export default Review;

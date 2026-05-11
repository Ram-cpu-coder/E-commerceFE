import React from "react";
import { IoStarOutline } from "react-icons/io5";
import { IoStarHalfOutline } from "react-icons/io5";
import { IoStar } from "react-icons/io5";

const Stars = ({ avgRating }) => {
  const MAXRATING = 5;

  const fullStars = Math.floor(avgRating);
  const halfStar = !Number.isInteger(avgRating);
  const emptyStar = MAXRATING - fullStars - (halfStar ? 1 : 0);

  const stars = [];

  for (let i = 1; i <= fullStars; i++) {
    stars.push(<IoStar className="text-warning" key={`full-${i}`} />);
  }
  halfStar &&
    stars.push(
      <IoStarHalfOutline className="text-warning text-secondary" key="half" />
    );

  if (emptyStar) {
    for (let i = 1; i <= emptyStar; i++) {
      stars.push(<IoStarOutline className="text-warning" key={`empty-${i}`} />);
    }
  }
  return (
    <div className="d-flex align-items-center" style={{ maxHeight: "20px", fontSize:"15px"}}>
      <div className="d-flex align-items-center">
        {stars}
      </div>
    </div>
  );
};

export default Stars;
